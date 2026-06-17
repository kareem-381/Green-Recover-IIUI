// src/app/api/signin/route.js
import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import bcrypt from "bcryptjs"; 
import nodemailer from "nodemailer";

// Global cache tracking for password reset verification sessions
global.resetCache = global.resetCache || new Map();

// ─── 1. SIGN IN CREDENTIALS VERIFICATION HANDLER ───
export async function POST(req) {
  try {
    const body = await req.json();
    const { email, password } = body;

    const cleanEmail = email.trim().toLowerCase();

    const isStudent = cleanEmail.endsWith("@student.iiu.edu.pk");
    const isFaculty = cleanEmail.endsWith("@iiu.edu.pk");

    if (!isStudent && !isFaculty) {
      return NextResponse.json({ 
        success: false, 
        message: "Authentication rejected. Only official IIUI domains are allowed." 
      }, { status: 400 });
    }

    const db = await connectDB();

    // Fetch account details matching email criteria
    const [users] = await db.query(
      "SELECT id, full_name, email, password, gender, status FROM users WHERE email = ?",
      [cleanEmail]
    );

    if (users.length === 0) {
      return NextResponse.json({ success: false, message: "No account exists with this email address." }, { status: 401 });
    }

    const userRecord = users[0];

    // BAN SECURITY ENFORCEMENT INTERCEPTOR
    if (userRecord.status === 'banned') {
      return NextResponse.json({ 
        success: false, 
        message: "❌ Access Denied: Your account has been permanently suspended by IIUI Security Authorities for violating content and safety guidelines." 
      }, { status: 403 });
    }

    // Cryptographic match cross-examination
    const isPasswordCorrect = await bcrypt.compare(password, userRecord.password);

    if (!isPasswordCorrect) {
      return NextResponse.json({ success: false, message: "Incorrect password entered. Please check keys carefully." }, { status: 401 });
    }

    return NextResponse.json({
      success: true,
      message: "Authentication successful!",
      user: {
        id: userRecord.id,
        full_name: userRecord.full_name,
        email: userRecord.email,
        gender: userRecord.gender       
      }
    });

  } catch (error) {
    console.error("🔥 Sign In POST Handler Exception:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// ─── 2. FORGOT PASSWORD MODAL PROTOCOL HANDLER ───
export async function PATCH(req) {
  try {
    const body = await req.json();
    const { action, email } = body;
    const cleanEmail = email.trim().toLowerCase();
    const db = await connectDB();

    // PART A: GENERATE RECOVERY TOKENS AND DISPATCH MAIL
    if (action === "REQUEST_RESET_OTP") {
      const [userCheck] = await db.query("SELECT id FROM users WHERE email = ?", [cleanEmail]);
      if (userCheck.length === 0) {
        return NextResponse.json({ success: false, message: "No account exists with this email address." }, { status: 404 });
      }

      const generatedOtp = Math.floor(100000 + Math.random() * 900000).toString();
      const expires = Date.now() + 5 * 60 * 1000; // 5 minute window

      global.resetCache.set(cleanEmail, { otp: generatedOtp, expiresAt: expires });

      console.log(`\n==============================================\n[⚠️ PASSWORD RESET TOKENS]:\nTARGET ENTITY: ${cleanEmail}\nACTIVE RESET KEY: ${generatedOtp}\n==============================================\n`);

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
          from: '"Green-Recover Security" <no-reply@iiu.edu.pk>',
          to: cleanEmail,
          subject: "Green-Recover Account Recovery Key",
          html: `
            <div style="font-family: Arial, sans-serif; padding: 20px; background-color: #0c1a12; color: #f0fdf4; border-radius: 12px; max-width: 500px;">
              <h2 style="color: #84cc16; text-align: center;">Green-Recover Reset Protocol</h2>
              <p style="font-size: 14px; color: #bbf7d0;">A request was triggered to reset your portal password access credentials. Your safety recovery token is:</p>
              <div style="background-color: #7f1d1d; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 4px; color: #ffffff; border-radius: 8px; margin: 20px 0;">
                ${generatedOtp}
              </div>
              <p style="font-size: 11px; color: #f87171; text-align: center;">If you did not initiate this request, change your security bounds immediately.</p>
            </div>
          `
        });
      } catch (mailErr) {
        console.error("❌ Reset Email Dispatch Failure:", mailErr.message);
      }

      return NextResponse.json({ success: true, message: "Recovery code dispatched successfully." });
    }

    // PART B: VERIFY CODE AND COMMIT ENCRYPTED PASS DATA
    if (action === "VERIFY_AND_RESET") {
      const { otp, newPassword } = body;
      const cachedSession = global.resetCache.get(cleanEmail);

      if (!cachedSession) {
        return NextResponse.json({ success: false, message: "No active password recovery session exists." }, { status: 400 });
      }

      if (Date.now() > cachedSession.expiresAt) {
        global.resetCache.delete(cleanEmail);
        return NextResponse.json({ success: false, message: "Recovery code session has expired." }, { status: 400 });
      }

      if (cachedSession.otp !== otp) {
        return NextResponse.json({ success: false, message: "Incorrect security token value." }, { status: 400 });
      }

      // Hash the brand-new password selection safely before inserting
      const freshHashedPassword = await bcrypt.hash(newPassword, 10);

      await db.query("UPDATE users SET password = ? WHERE email = ?", [freshHashedPassword, cleanEmail]);
      global.resetCache.delete(cleanEmail);

      return NextResponse.json({ success: true, message: "Password updated successfully!" });
    }

    return NextResponse.json({ success: false, message: "Invalid patch protocol requested." }, { status: 400 });

  } catch (error) {
    console.error("🔥 Password Reset PATCH Handler Exception:", error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}