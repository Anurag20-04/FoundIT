import { useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import "./LoginModal.css";
import loginBg from "../assets/login-bg.png";
import eyeClosed from "../assets/Hide.png";
import eyeOpen from "../assets/Show.png";

export default function LoginModal({ theme = "light", onClose, switchToSignup }) {
  const { login } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await axios.post("http://localhost:5000/api/login", {
        email,
        password,
      });

      // ✅ SINGLE SOURCE OF TRUTH
      login(res.data.user, res.data.token);

      onClose(); // closes modal cleanly
    } catch (err) {
      console.error(err);
      setError("User does not exist or password is incorrect.");
    }
  };

  return (
    <div className="login-overlay" onClick={onClose}>
      <div
        className={`login-modal ${theme}`}
        onClick={(e) => e.stopPropagation()}
      >
        {/* LEFT IMAGE */}
        <div
          className="login-left"
          style={{ backgroundImage: `url(${loginBg})` }}
        />

        {/* RIGHT FORM */}
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

            <button type="submit" className="login-btn">
              Log in
            </button>
          </form>

          <p className="switch-text">
            Don’t have an account?
            <span onClick={switchToSignup}> Sign up</span>
          </p>
        </div>
      </div>
    </div>
  );
}
