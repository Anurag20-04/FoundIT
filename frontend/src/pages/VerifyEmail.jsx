import { useEffect, useState } from "react";
import axios from "axios";
import { useSearchParams, useNavigate } from "react-router-dom";
import "./VerifyEmail.css";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  const [status, setStatus] = useState("loading"); // loading | success | error
  const [message, setMessage] = useState("");

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      setStatus("error");
      setMessage("Invalid or missing verification token.");
      return;
    }

    const verifyEmail = async () => {
      try {
        const res = await axios.get(
          `${import.meta.env.VITE_API_BASE_URL}/verify-email?token=${token}`
        );

        setStatus("success");
        setMessage(res.data.message || "Email verified successfully.");
      } catch (err) {
        setStatus("error");
        setMessage(
          err?.response?.data?.message ||
            "Verification link is invalid or expired."
        );
      }
    };

    verifyEmail();
  }, [searchParams]);

  return (
    <div className="verify-email-page">
      <div
        className={`verify-email-card ${
          status === "loading"
            ? "verify-loading"
            : status === "success"
            ? "verify-success"
            : "verify-error"
        }`}
      >
        {status === "loading" && (
          <>
            <div className="verify-icon">⏳</div>
            <h2>Verifying Email</h2>
            <p>Please wait while we verify your email address.</p>
          </>
        )}

        {status === "success" && (
          <>
            <div className="verify-icon">✅</div>
            <h2>Email Verified</h2>
            <p>{message}</p>
            <button onClick={() => navigate("/")}>Go to Login</button>
          </>
        )}

        {status === "error" && (
          <>
            <div className="verify-icon">❌</div>
            <h2>Verification Failed</h2>
            <p>{message}</p>
          </>
        )}
      </div>
    </div>
  );
}
