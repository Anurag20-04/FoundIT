import { useState } from "react";
import axios from "axios";
import "./SignupModal.css";
import signupBg from "../assets/signup-bg.png";
import eyeClosed from "../assets/Hide.png";
import eyeOpen from "../assets/Show.png";

export default function SignupModal({ theme = "light", onClose, switchToLogin }) {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    address: "",
    idProof: "",
    aadharNumber: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      // ✅ Adjust URL to your production/backend endpoint if needed
      await axios.post("http://localhost:5000/api/signup", form);
      
      // Successfully signed up, now switch to login modal
      switchToLogin();
    } catch (err) {
      console.log("SIGNUP ERROR:", err.response || err);
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

        {/* RIGHT FORM */}
        <div className="signup-right">
          <button className="close-btn" onClick={onClose}>×</button>

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

            <input
              type="text"
              name="phoneNumber"
              placeholder="Phone number"
              required
              value={form.phoneNumber}
              onChange={handleChange}
            />

            <input
              type="text"
              name="address"
              placeholder="Address"
              required
              value={form.address}
              onChange={handleChange}
            />

            <input
              type="text"
              name="idProof"
              placeholder="ID Proof (e.g. PAN / Voter ID)"
              required
              value={form.idProof}
              onChange={handleChange}
            />

            <input
              type="text"
              name="aadharNumber"
              placeholder="Aadhar number"
              required
              value={form.aadharNumber}
              onChange={handleChange}
            />

            {/* PASSWORD */}
            <div className="password-field">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                required
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
        </div>
      </div>
    </div>
  );
}