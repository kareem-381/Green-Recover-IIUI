// Inside your signup component file
"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import styles from "./signup.module.css";

export default function Signup() {
  const router = useRouter();
  
  const [step, setStep] = useState(1); 
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  
  // 👁️ Double State Layout tracking visibility hooks independently
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  
  const [gender, setGender] = useState("Male"); 
  const [otp, setOtp] = useState("");

  const [timeLeft, setTimeLeft] = useState(60);
  const [canResend, setCanResend] = useState(false);

  useEffect(() => {
    if (step !== 2 || timeLeft === 0) {
      if (timeLeft === 0) setCanResend(true);
      return;
    }
    const timer = setInterval(() => {
      setTimeLeft((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(timer);
  }, [step, timeLeft]);

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setError("");

    const cleanEmail = email.trim().toLowerCase();
    const isStudent = cleanEmail.endsWith("@student.iiu.edu.pk");
    const isFaculty = cleanEmail.endsWith("@iiu.edu.pk");

    if (!isStudent && !isFaculty) {
      setError("This email cannot be entered. Only @student.iiu.edu.pk or @iiu.edu.pk domains are allowed.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REQUEST_OTP", fullName, email: cleanEmail, password, gender }), 
      });
      const data = await res.json();

      if (data.success) {
        setStep(2);
        setTimeLeft(60);
        setCanResend(false);
      } else {
        setError(data.message || "An issue occurred.");
      }
    } catch (err) {
      setError("Unable to process request at this time.");
    } finally {
      setLoading(false);
    }
  };

  const handleOtpVerify = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "VERIFY_OTP", email: email.trim().toLowerCase(), otp }),
      });
      const data = await res.json();

      if (data.success) {
        localStorage.setItem("iiui_user_logged", JSON.stringify(data.user));
        router.push("/dashboard");
      } else {
        setError(data.message || "Invalid or expired OTP code.");
      }
    } catch (err) {
      setError("Failed to verify code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendClick = async () => {
    setError("");
    setOtp("");
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REQUEST_OTP", fullName, email: email.trim().toLowerCase(), password, gender }),
      });
      const data = await res.json();
      if (data.success) {
        setTimeLeft(60);
        setCanResend(false);
      } else {
        setError(data.message);
      }
    } catch (err) {
      setError("Failed to resend code.");
    }
  };

  return (
    <div className={styles.maincontainer}>
      <div className={styles.formCard}>

        {error && <div className={styles.errorAlert}>⚠️ {error}</div>}

        {step === 1 ? (
          <form onSubmit={handleFormSubmit}>
            <h2>Help keep IIUI Connected</h2>

            <p>Full Name</p>
            <input type="text" required placeholder="Abdul Kareem" value={fullName} onChange={(e) => setFullName(e.target.value)} />

            <p>Email</p>
            <input type="text" required placeholder="@student.iiu.edu.pk" value={email} onChange={(e) => setEmail(e.target.value)} />
            
            <p>Gender</p>
            <select value={gender} onChange={(e) => setGender(e.target.value)} className={styles.genderSelect}>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
            </select>

           <p>Password</p>
            {/* 🎯 FIXED: Core Password Input */}
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
            
            <p>Confirm Password</p>
            {/* 🎯 FIXED: Confirm Password Input */}
            <div className={styles.passwordWrapper}>
              <input 
                type={showConfirmPassword ? "text" : "password"} 
                required 
                value={confirmPassword} 
                onChange={(e) => setConfirmPassword(e.target.value)} 
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className={styles.eyeButton}
              >
                {showConfirmPassword ? "🙈" : "👁️"}
              </button>
            </div>

            <button type="submit" style={{ marginTop: "20px" }}>
              {loading ? "Sending OTP..." : "Let's Connect"}
            </button>
          </form>
        ) : (
          <form onSubmit={handleOtpVerify}>
            <h2>Verify Your Email</h2>
            <div style={{ color: "#bbf7d0", fontSize: "14px", marginBottom: "20px", textAlign: "center" }}>
              A 6-digit verification code was sent to <br />
              <strong>{email}</strong>
            </div>

            <p>Enter OTP Code</p>
            <input
              type="text"
              required
              maxLength={6}
              placeholder="000000"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              style={{ textAlign: "center", letterSpacing: "6px", fontSize: "18px" }}
            />

            <button type="submit">
              {loading ? "Verifying..." : "Verify & Sign Up"}
            </button>

            {!canResend ? (
              <div className={styles.clockText}>
                Code expires in: <span style={{ color: "#ef4444", fontWeight: "bold" }}>{timeLeft}s</span>
              </div>
            ) : (
              <div className={styles.clockText}>
                Didn't get the code?{" "}
                <button type="button" onClick={handleResendClick} className={styles.resendBtn}>
                  Resend OTP Code
                </button>
              </div>
            )}
          </form>
        )}

        <hr style={{ margin: "20px 0", opacity: 0.2 }} />
      </div>
    </div>
  );
}