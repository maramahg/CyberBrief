import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./ForgotPassword.css"; // Reuse same styling

const ResetPassword = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const email = searchParams.get("email");

  const [newPassword, setNewPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleReset = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, newPassword }),
    });

    const data = await res.json();
    if (res.ok) {
      navigate("/password-changed");
    } else {
      setMessage(data.error || "Password reset failed");
    }
  };

  if (!token || !email) {
    return (
      <div className="forgot-password-container">
        <div className="forgot-password-content">
          <div className="forgot-password-branding-section">
            <div className="forgot-password-branding-overlay">
              <h1 className="forgot-password-brand-title">CyberBrief</h1>
            </div>
          </div>

          <div className="forgot-password-form-section">
            <div className="forgot-password-form-content">
              <h2 className="forgot-password-title">Invalid Link</h2>
              <p className="forgot-password-subtitle">
                Reset link is missing or invalid.
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="forgot-password-container">
      <div className="forgot-password-content">
        <div className="forgot-password-branding-section">
          <div className="forgot-password-branding-overlay">
            <h1 className="forgot-password-brand-title">CyberBrief</h1>
          </div>
        </div>

        <div className="forgot-password-form-section">
          <div className="forgot-password-form-content">
            <h2 className="forgot-password-title">Reset Your Password</h2>
            <p className="forgot-password-subtitle">
              Enter your new password below.
            </p>

            <form className="forgot-password-form" onSubmit={handleReset}>
              <div className="form-group">
                <input
                  type="password"
                  placeholder="New password"
                  className="form-input"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="reset-button">
                Reset Password
              </button>
            </form>

            {message && <p className="error-message">{message}</p>}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
