// src/app/api/posts/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    // 1. Ensure table structural properties exist
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
        image_path LONGTEXT NULL, -- Changed to LONGTEXT to safely hold big Base64 image strings!
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 2. Fetch all active rows
    const [rows] = await db.query(`
      SELECT 
        id, type, category, location, time_found, 
        description, image_path, gender, full_name, reg_number, email 
      FROM posts 
      ORDER BY id DESC
    `);
    
    console.log("🚀 FEED API LOG -> Sent Rows cleanly:", rows.length);
    
    return NextResponse.json({ success: true, posts: rows || [] }, { 
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" } 
    });

  } catch (error) {
    console.error("🔥 Dashboard Feed API Route Crash Tracker:", error.message);
    return NextResponse.json({ 
      success: false, 
      posts: [], 
      message: "Database pipeline is currently unreachable." 
    }, { status: 500 });
  }
}