import { useState } from "react";
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

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await axios.post("http://localhost:5000/api/signup", {
        name: form.name.trim(),
        email: form.email.trim(),
        password: form.password,
      });

      // ✅ show success screen instead of redirect
      setSuccess(true);

    } catch (err) {
      console.error("SIGNUP ERROR:", err.response || err);
      setError(
        err?.response?.data?.message ||
        "Signup failed. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="signup-overlay" onClick={onClose}>
      <div
        className={`signup-modal ${theme}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT IMAGE */}
        <div
          className="signup-left"
          style={{ backgroundImage: `url(${signupBg})` }}
        />

        {/* RIGHT */}
        <div className="signup-right">
          <button className="close-btn" onClick={onClose}>×</button>

          {!success ? (
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

                {/* PASSWORD */}
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

                <button
                  type="submit"
                  className="signup-btn"
                  disabled={loading}
                >
                  {loading ? "Creating account..." : "Create account"}
                </button>
              </form>

              <p className="switch-text">
                Already have an account?
                <span onClick={switchToLogin}> Log in</span>
              </p>
            </>
          ) : (
            <>
              <h2>Verify your email</h2>

              <p style={{ marginTop: "14px", lineHeight: "1.6" }}>
                We’ve sent a verification link to your email address.
                <br />
                Please check your inbox and click the link to activate your account.
              </p>

              <p
                style={{
                  marginTop: "10px",
                  fontSize: "0.85rem",
                  color: "var(--text-secondary)",
                }}
              >
                You won’t be able to log in until your email is verified.
              </p>

              <button
                className="signup-btn"
                style={{ marginTop: "24px" }}
                onClick={switchToLogin}
              >
                Go to Login
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
