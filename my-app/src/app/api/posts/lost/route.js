// src/app/api/posts/lost/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import fs from "fs/promises";
import path from "path";

// 🔌 ULTRAMSG PRODUCTION CLOUD CONFIGURATION
const ULTRAMSG_INSTANCE = "instance181216"; 
const ULTRAMSG_TOKEN = "osv8viyss770rlwp"; 

// 🎯 IIUI CAMPUS ROUTING GROUP ID STRINGS
const MALE_GROUP_ID = "120363426066494393@g.us";   
const FEMALE_GROUP_ID = "120363409307909561@g.us"; 

export async function POST(req) {
  try {
    const dataStream = await req.formData();
    
    const fullName = dataStream.get("fullName");
    const regNumber = dataStream.get("regNumber");
    const iiuiEmail = dataStream.get("iiuiEmail"); 
    const cellNumber = dataStream.get("cellNumber");
    const gender = dataStream.get("gender") || "Male"; 
    const category = dataStream.get("category");
    const location = dataStream.get("location");
    const timeLost = dataStream.get("timeLost");
    const description = dataStream.get("description");
    const itemImageFile = dataStream.get("itemImage");

    let storedImagePathString = null;

    if (itemImageFile && itemImageFile.size > 0) {
      const targetDirectoryPath = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(targetDirectoryPath, { recursive: true });
      const sanitizedName = itemImageFile.name.replace(/\s+/g, "_");
      const generatedFileName = `${Date.now()}_${sanitizedName}`;
      await fs.writeFile(path.join(targetDirectoryPath, generatedFileName), Buffer.from(await itemImageFile.arrayBuffer()));
      storedImagePathString = `/uploads/${generatedFileName}`;
    }

    const db = await connectDB();

    // Write lost entry to MySQL database row matching unified table structure
    await db.query(
      `INSERT INTO posts 
      (type, full_name, reg_number, email, cell_number, gender, category, location, time_found, description, image_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["lost", fullName, regNumber, iiuiEmail, cellNumber, gender, category, location, timeLost, description, storedImagePathString]
    );

    // ─── 🔊 ULTRAMSG LOST ITEM ALERTS ENGINE ───
    const broadcastMessage = 
`🚨 *GREEN-RECOVER CAMPUS ALERT* 🚨
--------------------------------
👉 *Status:* 🛑 LOST ITEM REPORT SOS
📦 *Category:* ${category}
📍 *Lost Around:* ${location.toUpperCase()}
🕒 *Estimated Time:* ${timeLost}

📝 *Description:* "${description}"
--------------------------------
📞 *Contact Owner:* ${cellNumber}
_Please help your fellow student find this item._`;

    const targetDestinationId = gender.toLowerCase() === 'male' ? MALE_GROUP_ID : FEMALE_GROUP_ID;

    try {
      await fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          token: ULTRAMSG_TOKEN,
          to: targetDestinationId,
          body: broadcastMessage,
          priority: "1"
        })
      });
      console.log(`🔊 Lost alert sent to ${gender} channel successfully.`);
    } catch (apiErr) {
      console.error("❌ Outbound WhatsApp Lost Gateway Error:", apiErr.message);
    }
    // ─── 🔊 ULTRAMSG LOST ITEM ALERTS ENGINE END ───

    return NextResponse.json({ success: true, message: "Lost report saved and WhatsApp alert broadcasted!" });

  } catch (error) {
    console.error("❌ Lost Post Insertion Failure:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}