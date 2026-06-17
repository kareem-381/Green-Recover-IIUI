// src/app/api/posts/[id]/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

// 🌟 FIXED: Await the dynamic parameters block to guarantee perfect id tracking bounds
export async function GET(req, { params }) {
  try {
    const resolvedParams = await params; 
    const { id } = resolvedParams;

    console.log("🔍 Executing Single Post Query Fetch for ID:", id);

    const db = await connectDB();
    const [rows] = await db.query("SELECT * FROM posts WHERE id = ?", [id]);

    if (rows.length === 0) {
      console.warn(`⚠️ Entry item row with ID ${id} does not exist in MySQL.`);
      return NextResponse.json({ success: false, message: "Report item not found in database records." }, { status: 404 });
    }

    return NextResponse.json({ success: true, post: rows[0] });
  } catch (error) {
    console.error("🔥 Single Post Fetch Failure:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}