// src/app/(public)/signin/page.js
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import styles from "./signin.module.css";

export default function SignIn() {
  const router = useRouter();
  
  // Login States
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  // Forgot Password Modal States
  const [showModal, setShowModal] = useState(false);
  const [modalStep, setModalStep] = useState(1); // 1: Email, 2: OTP & New Password
  const [resetEmail, setResetEmail] = useState("");
  const [resetOtp, setResetOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [modalError, setModalError] = useState("");
  const [modalMessage, setModalMessage] = useState("");

  const handleSignInSubmit = async (e) => {
    e.preventDefault();
    setError("");
    
    const cleanEmail = email.trim().toLowerCase();
    const isStudent = cleanEmail.endsWith("@student.iiu.edu.pk");
    const isFaculty = cleanEmail.endsWith("@iiu.edu.pk");

    if (!isStudent && !isFaculty) {
      setError("This email cannot be entered. Only @student.iiu.edu.pk or @iiu.edu.pk accounts are allowed.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: cleanEmail, password }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("iiui_user_logged", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid credentials specified.");
      }
    } catch (err) {
      setError("Unable to connect to the authentication database gateway.");
    } finally {
      setLoading(false);
    }
  };

  // Trigger Backend to send OTP for Password Reset
  const handleRequestResetOtp = async (e) => {
    e.preventDefault();
    setModalError("");
    setModalMessage("");
    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "PATCH", // Using PATCH to represent a modification request
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REQUEST_RESET_OTP", email: resetEmail.trim().toLowerCase() }),
      });
      const data = await res.json();

      if (data.success) {
        setModalMessage("🔐 Verification code dispatched to your email!");
        setModalStep(2);
      } else {
        setModalError(data.message || "Email address not found.");
      }
    } catch (err) {
      setModalError("Failed to communicate with authorization server.");
    } finally {
      setLoading(false);
    }
  };

  // Submit OTP and New Hashed Password to Database
  const handleVerifyAndResetPassword = async (e) => {
    e.preventDefault();
    setModalError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signin", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "VERIFY_AND_RESET",
          email: resetEmail.trim().toLowerCase(),
          otp: resetOtp,
          newPassword: newPassword
        }),
      });
      const data = await res.json();

      if (data.success) {
        alert("🎉 Password changed successfully! You can now sign in with your new password.");
        setShowModal(false);
        setModalStep(1);
        setResetEmail("");
        setResetOtp("");
        setNewPassword("");
      } else {
        setModalError(data.message || "Invalid code or configuration.");
      }
    } catch (err) {
      setModalError("Failed to update password cell string.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.maincontainer}>
      <div className={styles.formCard}>

        <h2>Green Recover Welcome Back!</h2>

        {error && <div className={styles.errorAlert}>⚠️ {error}</div>}

        <form onSubmit={handleSignInSubmit}>
          <p id="email">Email</p>
          <input
            type="text"
            required
            placeholder="yourname@student.iiu.edu.pk"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <p id="password">Password</p>
          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className={styles.eyeButton}
            >
              {showPassword ? "🙈" : "👁️"}
            </button>
          </div>

          {/* 🔗 RESPONSIVE Forgot Password Link Alignment Box */}
<div style={{ textAlign: "right", width: "100%", marginTop: "-10px", marginBottom: "15px" }}>
  <span 
    onClick={() => { setShowModal(true); setModalStep(1); setModalError(""); setModalMessage(""); }}
    style={{ color: "#84cc16", cursor: "pointer", fontSize: "13px", textDecoration: "underline" }}
  >
    Forgot Password?
  </span>
</div>

          <button type="submit" disabled={loading} style={{ marginTop: "25px" }}>
            {loading ? "Signing In..." : "Sign In"}
          </button>
        </form>

      </div>

      {/* 🛡️ MODAL LAYOUT POPUP BOX OVERLAY */}
      {showModal && (
        <div style={{
          position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
          backgroundColor: "rgba(0,0,0,0.75)", display: "flex", justifyContent: "center", alignItems: "center", zIndex: 100
        }}>
          <div className={styles.formCard} style={{ minHeight: "auto", position: "relative" }}>
            
            <span 
              onClick={() => setShowModal(false)}
              style={{ position: "absolute", right: "20px", top: "15px", color: "#ef4444", cursor: "pointer", fontSize: "20px", fontWeight: "bold" }}
            >
              ✕
            </span>

            <h3 style={{ color: "#f0fdf4", textAlign: "center", marginBottom: "20px" }}>🔑 Account Recovery</h3>

            {modalError && <div className={styles.errorAlert}>⚠️ {modalError}</div>}
            {modalMessage && <div style={{ color: "#bbf7d0", fontSize: "14px", textAlign: "center", marginBottom: "15px" }}>{modalMessage}</div>}

            {modalStep === 1 ? (
              <form onSubmit={handleRequestResetOtp}>
                <p>Enter Account Email</p>
                <input 
                  type="text" 
                  required 
                  placeholder="yourname@student.iiu.edu.pk" 
                  value={resetEmail} 
                  onChange={(e) => setResetEmail(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Processing..." : "Send Verification Code"}
                </button>
              </form>
            ) : (
              <form onSubmit={handleVerifyAndResetPassword}>
                <p>Enter 6-Digit OTP</p>
                <input 
                  type="text" 
                  required 
                  placeholder="000000" 
                  maxLength={6}
                  value={resetOtp} 
                  onChange={(e) => setResetOtp(e.target.value)}
                  style={{ textAlign: "center", letterSpacing: "4px" }}
                />
                <p>Enter New Password</p>
                <input 
                  type="password" 
                  required 
                  placeholder="••••••••" 
                  value={newPassword} 
                  onChange={(e) => setNewPassword(e.target.value)}
                />
                <button type="submit" disabled={loading}>
                  {loading ? "Resetting..." : "Update Password"}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}