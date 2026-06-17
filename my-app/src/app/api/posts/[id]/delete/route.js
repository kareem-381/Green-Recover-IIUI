// src/app/api/posts/[id]/delete/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function DELETE(req, { params }) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    const db = await connectDB();
    
    // Execute direct row eviction based on primary key identifier
    const [result] = await db.query("DELETE FROM posts WHERE id = ?", [id]);

    if (result.affectedRows === 0) {
      return NextResponse.json({ success: false, message: "Record already removed or not found." }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: "Announcement cleanly purged from database matrix!" });
  } catch (error) {
    console.error("🔥 Purge API Exception Error:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}