// src/app/api/posts/create/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// 🔌 ULTRAMSG INSTANCE CREDENTIALS
const ULTRAMSG_INSTANCE = "instance181216"; 
const ULTRAMSG_TOKEN = "osv8viyss770rlwp";       // 👈 Paste your real UltraMsg secret token string

// 🎯 IIUI CAMPUS ROUTING GROUP ID STRINGS
const MALE_GROUP_ID = "120363426066494393@g.us";   // 👈 Paste your Male Group ID string here
const FEMALE_GROUP_ID = "120363409307909561@g.us"; // 👈 Paste your Female Group ID string here

export async function POST(req) {
  try {
    const body = await req.json();
    const { type, full_name, reg_number, email, cell_number, gender, category, location, time_found, description, image_path } = body;

    const db = await connectDB();

    // 1. Core Transaction: Write report safely inside your MySQL posts table
    const [result] = await db.query(`
      INSERT INTO posts (type, full_name, reg_number, email, cell_number, gender, category, location, time_found, description, image_path)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [type, full_name, reg_number, email, cell_number, gender, category, location, time_found, description, image_path]);

    // ─── 🔊 ULTRAMSG OUTBOUND WHATSAPP ALERTS ENGINE ───
    
    // Constructing an engaging markdown notification card for WhatsApp
    const broadcastMessage = 
`🚨 *GREEN-RECOVER CAMPUS ALERT* 🚨
--------------------------------
👉 *Status:* ${type.toUpperCase() === 'LOST' ? '🛑 LOST ITEM REPORT' : '✅ FOUND ITEM BROADCAST'}
📦 *Item Category:* ${category}
📍 *Last Seen Location:* ${location.toUpperCase()}
🕒 *Estimated Time:* ${time_found}

📝 *Description:* "${description}"
--------------------------------
📞 *Contact Coordinator:* ${cell_number}
_This alert was dispatched automatically via Green-Recover Systems._`;

    // Dynamic Segment Routing Logic: Determines targeted endpoint destinations 
    const targetDestinationId = gender.toLowerCase() === 'male' ? MALE_GROUP_ID : FEMALE_GROUP_ID;

    try {
      // Outbound HTTPS connection execution directly targeting UltraMsg infrastructure clusters
      const gatewayResponse = await fetch(`https://api.ultramsg.com/${ULTRAMSG_INSTANCE}/messages/chat`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({
          token: ULTRAMSG_TOKEN,
          to: targetDestinationId,
          body: broadcastMessage,
          priority: "1"
        })
      });

      const gatewayLog = await gatewayResponse.json();
      console.log("🔊 UltraMsg Transmission Pipeline Feedback:", gatewayLog);

    } catch (apiErr) {
      // Safe Catch Interceptor: Keeps user operations alive even if third-party web connection hits drops
      console.error("❌ Outbound WhatsApp Gateway Connection Error:", apiErr.message);
    }
    // ─── 🔊 ULTRAMSG OUTBOUND WHATSAPP ALERTS ENGINE END ───

    return NextResponse.json({ 
      success: true, 
      message: "Post successfully cataloged and broadcasted to campus network!", 
      postId: result.insertId 
    });

  } catch (error) {
    console.error("🔥 Post Creation Process Exception Gateway:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}