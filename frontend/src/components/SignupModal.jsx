import { useState, useEffect } from "react";
import axios from "axios";
import "./SignupModal.css";
import signupBg from "../assets/signup-bg.png";
import eyeClosed from "../assets/Hide.png";
import eyeOpen from "../assets/show.png";

export default function SignupModal({ theme = "light", onClose, switchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [step, setStep] = useState("signup");
  const [verified, setVerified] = useState(false);

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailForOTP, setEmailForOTP] = useState("");
  const [resendLoading, setResendLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  /* =========================
     AUTO LOAD OTP MODE
  ========================= */
  useEffect(() => {
    const savedEmail = localStorage.getItem("verifyEmail");
    if (savedEmail) {
      setEmailForOTP(savedEmail);
      setStep("otp");
    }
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  /* =========================
     FULL RESET + CLOSE
  ========================= */
  const handleClose = () => {
    localStorage.removeItem("verifyEmail");
    setStep("signup");
    setOtp(["", "", "", "", "", ""]);
    setEmailForOTP("");
    setError("");
    setVerified(false);
    onClose();
  };

  /* =========================
     OTP HANDLERS
  ========================= */
  const handleOtpChange = (value, index) => {
    if (!/^\d?$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`).focus();
    }
  };

  const handleOtpKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`).focus();
    }
  };

  /* =========================
     SIGNUP
  ========================= */
  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/signup`, {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      setEmailForOTP(res.data.email);
      localStorage.setItem("verifyEmail", res.data.email);
      setStep("otp");

    } catch (err) {
      setError(err?.response?.data?.message || "Signup failed.");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     VERIFY OTP
  ========================= */
  const verifyOtp = async () => {
    const finalOtp = otp.join("");
    if (finalOtp.length !== 6) {
      setError("Please enter the complete 6-digit code");
      return;
    }

    setLoading(true);
    setError("");

    try {
      await axios.post(`${API}/api/verify-email-otp`, {
        email: emailForOTP,
        otp: finalOtp,
      });

      setVerified(true);

      setTimeout(() => {
        localStorage.removeItem("verifyEmail");
        switchToLogin();
      }, 1600);

    } catch (err) {
      setError(err?.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setLoading(false);
    }
  };

  /* =========================
     RESEND OTP
  ========================= */
  const resendOtp = async () => {
    setResendLoading(true);
    setError("");

    try {
      await axios.post(`${API}/api/resend-email-otp`, {
        email: emailForOTP,
      });
    } catch {
      setError("Could not resend OTP.");
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="signup-overlay" onClick={handleClose}>
      <div className={`signup-modal ${theme}`} onClick={(e) => e.stopPropagation()}>
        <div
          className="signup-left"
          style={{ backgroundImage: `url(${signupBg})` }}
        />

        <div className="signup-right">
          <button className="close-btn" onClick={handleClose}>×</button>

          {step === "signup" && (
            <>
              <h2>Create account</h2>

              <form onSubmit={submit}>
                <input
                  type="text"
                  name="name"
                  placeholder="Full name"
                  required
                  value={form.name}
                  onChange={handleChange}
                />

                <input
                  type="email"
                  name="email"
                  placeholder="Email"
                  required
                  value={form.email}
                  onChange={handleChange}
                />

                <div className="password-field">
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    placeholder="Password"
                    required
                    minLength={6}
                    value={form.password}
                    onChange={handleChange}
                  />
                  <img
                    src={showPassword ? eyeOpen : eyeClosed}
                    alt="toggle password"
                    className="eye-icon"
                    onClick={() => setShowPassword(p => !p)}
                  />
                </div>

                {error && <p className="error-text">{error}</p>}

                <button type="submit" className="signup-btn" disabled={loading}>
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="switch-text">
                Already have an account?
                <span onClick={switchToLogin}> Log in</span>
              </p>
            </>
          )}

          {step === "otp" && !verified && (
            <>
              <h2>Verify your email</h2>

              <p style={{ marginTop: "10px", fontSize: "0.9rem" }}>
                We’ve sent a 6-digit code to:<br />
                <b>{emailForOTP}</b>
              </p>

              <div className="otp-box-wrapper">
                {otp.map((digit, i) => (
                  <input
                    key={i}
                    id={`otp-${i}`}
                    className="otp-box"
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength="1"
                    value={digit}
                    onChange={(e) => handleOtpChange(e.target.value, i)}
                    onKeyDown={(e) => handleOtpKeyDown(e, i)}
                    autoFocus={i === 0}
                  />
                ))}
              </div>

              <p className="otp-hint">Code expires in 1 hour</p>

              {error && <p className="error-text">{error}</p>}

              <button className="signup-btn" style={{ marginTop: "16px" }} onClick={verifyOtp} disabled={loading}>
                {loading ? "Verifying..." : "Verify OTP"}
              </button>

              <p className="resend-text" onClick={!resendLoading ? resendOtp : undefined}>
                {resendLoading ? "Sending..." : "Resend code"}
              </p>
            </>
          )}

          {verified && (
            <div className="verify-success">
              <div className="checkmark">✓</div>
              <h2>Email verified</h2>
              <p>Your account has been activated successfully.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
