// src/app/api/posts/lost/route.js
import { NextResponse } from "next/server"
import { connectDB } from "@/lib/db"

export async function POST(request) {
  try {
    const db = await connectDB()

    // 🎯 Parse incoming request as formData directly
    const formData = await request.formData()

    const fullName = formData.get("fullName")
    const regNumber = formData.get("regNumber")
    const iiuiEmail = formData.get("iiuiEmail")
    const cellNumber = formData.get("cellNumber")
    const gender = formData.get("gender")
    const category = formData.get("category")
    const location = formData.get("location")
    const timeLost = formData.get("timeLost")
    const description = formData.get("description")
    const imageBase64 = formData.get("imageBase64") // Reads our clean text string

    // Execute safe database transaction
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
        imageBase64 || null // Saves text string or null cleanly to Aiven
      ]
    )

    return NextResponse.json({ success: true, message: "Lost item saved live!" }, { status: 201 })

  } catch (error) {
    console.error("🔥 Lost Post API Endpoint Crash Log:", error)
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}