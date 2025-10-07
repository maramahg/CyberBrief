import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./ForgotPassword.css";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    const res = await fetch("http://localhost:5000/api/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    if (res.ok) {
      setMessage("Reset link sent! Check your email.");
    } else {
      setMessage(data.error || "Something went wrong.");
    }
  };

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
            <h2 className="forgot-password-title">Forgot Password</h2>
            <p className="forgot-password-subtitle">
              Enter your email and we’ll send you a reset link.
            </p>

            <form className="forgot-password-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email address"
                  className="form-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className="reset-button">
                Send Reset Link
              </button>
            </form>

            {message && <p className="success-message">{message}</p>}

            <div className="back-to-login-section">
              <span className="back-text">Back to </span>
              <Link to="/login" className="login-link">
                Login
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
