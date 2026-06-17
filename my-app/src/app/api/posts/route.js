// src/app/api/posts/lost/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";

export const config = {
  api: {
    bodyParser: true, // Tells the server to parse JSON text payloads cleanly
  },
};

export async function POST(request) {
  try {
    const db = await connectDB();
    const body = await request.json();

    const {
      fullName,
      regNumber,
      iiuiEmail,
      cellNumber,
      gender,
      category,
      location,
      timeLost,
      description,
      imageBase64
    } = body;

    // Direct transaction execute writing the Base64 data string straight into the image_path column
    await db.query(
      `INSERT INTO posts (
        type, full_name, reg_number, email, cell_number, 
        gender, category, location, time_found, description, image_path
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "lost",
        fullName,
        regNumber,
        iiuiEmail,
        cellNumber,
        gender,
        category,
        location,
        timeLost,
        description,
        imageBase64 // Saves raw image string natively into MySQL
      ]
    );

    return NextResponse.json({ success: true, message: "Lost item saved live!" }, { status: 201 });

  } catch (error) {
    console.error("🔥 Lost Post API Endpoint Crash Log:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}