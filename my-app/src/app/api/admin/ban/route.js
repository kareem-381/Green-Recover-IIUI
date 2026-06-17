// src/app/api/admin/ban/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { email, action } = body; // action will be 'banned' or 'active'

    if (!email || !action) {
      return NextResponse.json({ success: false, message: "Missing required parameters." }, { status: 400 });
    }

    const db = await connectDB();

    // Update the targeted student's status column cell
    const [result] = await db.query(
      "UPDATE users SET status = ? WHERE email = ?", 
      [action, email]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "User account profile not found." }, { status: 404 });
    }

    return NextResponse.json({ 
      success: true, 
      message: `User profile status successfully updated to ${action}!` 
    });

  } catch (error) {
    console.error("🔥 Admin Moderation Ban API Failure:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}