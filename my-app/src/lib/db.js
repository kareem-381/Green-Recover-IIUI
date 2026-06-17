// src/lib/db.js
import mysql from "mysql2/promise";

let pool;

export async function connectDB() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
      database: process.env.DB_NAME, // 🎯 FIX 1: Matches your Vercel/Local env variable key name!
      port: parseInt(process.env.DB_PORT || "28801"), // Ensures port 28801 is accurately parsed
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
      ssl: {
        rejectUnauthorized: false // 🎯 FIX 2: Required for cloud service clusters like Aiven!
      }
    });
  }
  return pool;
}