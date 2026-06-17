// src/app/api/posts/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export async function GET() {
  try {
    const db = await connectDB();

    // 1. Create the base table structure if it got dropped or cleared out during transitions
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

    // 2. Query execution with safe structural properties mappings
    const [rows] = await db.query(`
      SELECT 
        id AS id,
        type AS type,
        category AS category,
        location AS location,
        time_found AS time_found,
        description AS description,
        image_path AS image_path,
        gender AS gender,
        full_name AS full_name,
        reg_number AS reg_number,
        email AS email,
        'active' AS status
      FROM posts 
      ORDER BY id DESC
    `);
    
    console.log("🚀 BACKEND API LOG -> Sent Rows cleanly:", rows.length);
    
    // Always return a clean JSON format structure even if the rows array length is 0!
    return NextResponse.json({ success: true, posts: rows || [] }, { 
      status: 200,
      headers: { "Cache-Control": "no-store, max-age=0" } 
    });

  } catch (error) {
    console.error("🔥 Dashboard Feed API Route Crash Tracker:", error.message);
    
    // CRITICAL FIX: If database errors hit, send a valid JSON format fallback so res.json() doesn't fail on frontend!
    return NextResponse.json({ 
      success: false, 
      posts: [], 
      message: "Database pipeline is currently initializing or unreachable." 
    }, { status: 500 });
  }
}