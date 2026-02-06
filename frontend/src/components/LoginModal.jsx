import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./LoginModal.css";
import loginBg from "../assets/login-bg.png";
import eyeClosed from "../assets/Hide.png";
import eyeOpen from "../assets/show.png";

export default function LoginModal({ theme = "light", onClose, switchToSignup }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const API = import.meta.env.VITE_API_URL;

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const res = await axios.post(`${API}/api/login`, {
        email,
        password,
      });

      login(res.data.user, res.data.token);
      onClose();

    } catch (err) {
      console.error(err);

      /* =========================
         EMAIL NOT VERIFIED
      ========================= */
      if (err?.response?.data?.code === "EMAIL_NOT_VERIFIED") {
        alert("Please verify your email first. OTP has been sent.");

        // Save email so OTP modal/page can use it
        localStorage.setItem("verifyEmail", email);

        // Switch user to signup modal (OTP screen lives there)
        setTimeout(() => {
  switchToSignup();
}, 0);
return;

      }

      setError(
        err?.response?.data?.message ||
        "User does not exist or password is incorrect."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className={`login-modal ${theme}`}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="login-left"
          style={{ backgroundImage: `url(${loginBg})` }}
        />

        <div className="login-right">
          <button className="close-btn" onClick={onClose}>×</button>

          <h2>Log in</h2>

          <form onSubmit={submit}>
            <div className="field">
              <input
                type="email"
                placeholder="Email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="field password-field">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <img
                src={showPassword ? eyeOpen : eyeClosed}
                alt="toggle password"
                className="eye-icon"
                onClick={() => setShowPassword(p => !p)}
              />
            </div>

            {error && <p className="error-text">{error}</p>}

            <button type="submit" className="login-btn" disabled={loading}>
              {loading ? "Logging in..." : "Log in"}
            </button>
          </form>

          <p className="switch-text">
            Don’t have an account?
            <span
  onClick={() => {
    setTimeout(() => {
      switchToSignup();
    }, 0);
  }}
>
  {" "}Sign up
</span>

          </p>
        </div>
      </div>
    </div>
  );
}
