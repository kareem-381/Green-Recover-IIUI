// src/app/api/posts/found/route.js
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
    const timeFound = dataStream.get("timeFound");
    const description = dataStream.get("description");
    const itemImageFile = dataStream.get("itemImage");

    let storedImagePathString = null;

    // Handle incoming image buffers securely
    if (itemImageFile && itemImageFile.size > 0) {
      const targetDirectoryPath = path.join(process.cwd(), "public", "uploads");
      await fs.mkdir(targetDirectoryPath, { recursive: true });
      const sanitizedName = itemImageFile.name.replace(/\s+/g, "_");
      const generatedFileName = `${Date.now()}_${sanitizedName}`;
      await fs.writeFile(path.join(targetDirectoryPath, generatedFileName), Buffer.from(await itemImageFile.arrayBuffer()));
      storedImagePathString = `/uploads/${generatedFileName}`;
    }

    const db = await connectDB();

    // Ensure database infrastructure table limits are initialized
    await db.query(`
      CREATE TABLE IF NOT EXISTS posts (
        id INT AUTO_INCREMENT PRIMARY KEY,
        type VARCHAR(20) NOT NULL DEFAULT 'found',
        full_name VARCHAR(255) NOT NULL,
        reg_number VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL,
        cell_number VARCHAR(100) NOT NULL,
        gender VARCHAR(20) NOT NULL,
        category VARCHAR(100) NOT NULL,
        location VARCHAR(255) NOT NULL,
        time_found VARCHAR(255) NOT NULL,
        description TEXT NOT NULL,
        image_path VARCHAR(500) NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // Write found entry to MySQL
    await db.query(
      `INSERT INTO posts 
      (type, full_name, reg_number, email, cell_number, gender, category, location, time_found, description, image_path) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      ["found", fullName, regNumber, iiuiEmail, cellNumber, gender, category, location, timeFound, description, storedImagePathString]
    );

    // ─── 🔊 ULTRAMSG FOUND ITEM ALERTS ENGINE ───
    const broadcastMessage = 
`🚨 *GREEN-RECOVER CAMPUS ALERT* 🚨
--------------------------------
👉 *Status:* ✅ FOUND ITEM BROADCAST
📦 *Category:* ${category}
📍 *Found At:* ${location.toUpperCase()}
🕒 *Time Context:* ${timeFound}

📝 *Identifiers:* "${description}"
--------------------------------
📞 *Contact Finder:* ${cellNumber}
_Pushed via Green-Recover Cloud Automation Framework._`;

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
      console.log(`🔊 Found broadcast sent to ${gender} channel successfully.`);
    } catch (apiErr) {
      console.error("❌ Outbound WhatsApp Found Gateway Error:", apiErr.message);
    }
    // ─── 🔊 ULTRAMSG FOUND ITEM ALERTS ENGINE END ───

    return NextResponse.json({ success: true, message: "Found post saved and WhatsApp broadcast complete!" });

  } catch (error) {
    console.error("❌ Found Post Insertion Failure:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}