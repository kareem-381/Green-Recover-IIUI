// src/app/api/signup/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import nodemailer from "nodemailer";
import bcrypt from "bcryptjs"; // 🔑 Added cryptographic hashing link

// In-memory runtime token storage for development validation states
global.otpCache = global.otpCache || new Map();

export async function POST(req) {
  try {
    const body = await req.json();
    const { action, fullName, email, password, gender, otp } = body; 
    const db = await connectDB();

    // 🔥 FIX: Added 'status' column directly to schema auto-generation layout
    await db.query(`
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        full_name VARCHAR(255) NOT NULL,
        reg_number VARCHAR(100) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        gender VARCHAR(20) NOT NULL,       
        status VARCHAR(50) DEFAULT 'active',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // ─── STAGE 1: INITIATE REQUEST OTP GATEWAY ───
    if (action === "REQUEST_OTP") {
      const cleanEmail = email.trim().toLowerCase();
      
      const isStudent = cleanEmail.endsWith("@student.iiu.edu.pk");
      const isFaculty = cleanEmail.endsWith("@iiu.edu.pk");

      if (!isStudent && !isFaculty) {
        return NextResponse.json({ 
          success: false, 
          message: "This email cannot be entered. Only @student.iiu.edu.pk or @iiu.edu.pk accounts are allowed." 
        }, { status: 400 });
      }

      const [existingUsers] = await db.query("SELECT id FROM users WHERE email = ?", [cleanEmail]);
      if (existingUsers.length > 0) {
        return NextResponse.json({ success: false, message: "This email registration has already been utilized." }, { status: 400 });
      }

      // 🔐 HASH THE PASSWORD NOW before it enters memory cache storage state strings
      const hashedPassword = await bcrypt.hash(password, 10);

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expirationTimestamp = Date.now() + 60 * 1000; 

      global.otpCache.set(cleanEmail, {
        fullName,
        password: hashedPassword, // Saving the encrypted variant safely
        gender, 
        otp: generatedOtp,
        expiresAt: expirationTimestamp
      });

      console.log(`\n==============================================\n[🔥 SECURE IIUI VERIFICATION TOKENS]:\nTARGET ENTITY: ${cleanEmail}\nGENDER REGISTERED: ${gender}\nACTIVE OTP ACCESS KEY: ${generatedOtp}\n==============================================\n`);

      try {
        const transporter = nodemailer.createTransport({
          service: "gmail",
          host: "smtp.gmail.com",
          port: 465,
          secure: true,
          auth: { 
            user: "abdulkareem7646767@gmail.com",      
            pass: "rucxoyokgjxybadk"                    
          }
        });

        await transporter.sendMail({
          from: '"Green-Recover Portal" <no-reply@iiu.edu.pk>',
          to: cleanEmail,
          subject: "Green-Recover Security verification code",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0c1a12; color: #f0fdf4; border-radius: 12px; max-width: 500px;">
              <h2 style="color: #84cc16; text-align: center;">Green-Recover Portal</h2>
              <p style="font-size: 16px;">Assalam o Alaikum! Welcome to Green Recover<strong> ${fullName} </strong>,</p>
              <p style="font-size: 14px; color: #bbf7d0;">Your Green-Recover account verification security code is:</p>
              <div style="background-color: #14532d; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #ffffff; border-radius: 8px; margin: 20px 0;">
                ${generatedOtp}
              </div>
              <p style="font-size: 12px; color: #ef4444; text-align: center;">This security token is locked and will completely expire in 60 seconds.</p>
            </div>
          `
        });
        console.log("📨 Real OTP email dispatched successfully to:", cleanEmail);
      } catch (mailErr) {
        console.error("❌ Live Email Connection Failed:", mailErr.message);
      }

      return NextResponse.json({ success: true, message: "Verification token generated." });
    }

    // ─── STAGE 2: VALIDATE INTERACTIVE INPUTS AND COMPOSE ACCOUNTS ───
    if (action === "VERIFY_OTP") {
      const cleanEmail = email.trim().toLowerCase();
      const sessionCacheEntry = global.otpCache.get(cleanEmail);

      if (!sessionCacheEntry) {
        return NextResponse.json({ success: false, message: "No active session records found for this account." }, { status: 400 });
      }

      if (Date.now() > sessionCacheEntry.expiresAt) {
        global.otpCache.delete(cleanEmail);
        return NextResponse.json({ success: false, message: "Verification window expired. Please trigger a resend code request." }, { status: 400 });
      }

      if (sessionCacheEntry.otp !== otp) {
        return NextResponse.json({ success: false, message: "Incorrect token value. Please verify codes carefully." }, { status: 400 });
      }

      const mockRegDefault = cleanEmail.split("@")[0].toUpperCase() + "-IIUI";

      // Commits the already encrypted cache password string cell structure perfectly inside MySQL rows
      await db.query(
        "INSERT INTO users (full_name, reg_number, email, password, gender, status) VALUES (?, ?, ?, ?, ?, 'active')",
        [sessionCacheEntry.fullName, mockRegDefault, cleanEmail, sessionCacheEntry.password, sessionCacheEntry.gender]
      );

      const [newlyCreated] = await db.query("SELECT id, full_name, email, gender FROM users WHERE email = ?", [cleanEmail]);

      global.otpCache.delete(cleanEmail); 
      
      return NextResponse.json({ 
        success: true, 
        message: "User created successfully!",
        user: newlyCreated[0] 
      });
    }

    return NextResponse.json({ success: false, message: "Invalid route action profile context." }, { status: 400 });

  } catch (error) {
    console.error("Backend Gateway Exception:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}