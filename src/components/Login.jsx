import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";

const Login = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    rememberMe: false,
  });
  const [certFile, setCertFile] = useState(null);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  // Handle password login
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch("http://localhost:5000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.error || "Login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate(data.role === "admin" ? "/admin-homepage" : "/employee-homepage");
    } catch (err) {
      alert(err.message);
    }
  };

  // Handle certificate upload
  const handleCertUpload = (e) => {
    setCertFile(e.target.files[0]);
  };

  // Handle certificate login
  const handleCertLogin = async () => {
    if (!certFile) return alert("Please upload your certificate.");

    const formData = new FormData();
    formData.append("certificate", certFile);

    try {
      const response = await fetch("http://localhost:5000/api/login-certificate", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data?.message || "Certificate login failed");

      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.role);
      navigate(data.role === "admin" ? "/admin-homepage" : "/employee-homepage");
    } catch (err) {
      alert("Invalid certificate: " + err.message);
    }
  };

  return (
    <div className="login-container">
      <div className="login-content">
        <div className="login-branding-section">
          <div className="login-branding-overlay">
            <h1 className="login-brand-title">CyberBrief</h1>
          </div>
        </div>

        <div className="login-form-section">
          <div className="login-form-content">
            <h2 className="login-title">Log in to access your account</h2>

            {/* Username & Password Login */}
            <form onSubmit={handleSubmit} className="login-form">
              <div className="form-group">
                <label htmlFor="username" className="form-label">Username*</label>
                <div className="input-wrapper">
                  <input
                    type="text"
                    id="username"
                    name="username"
                    value={formData.username}
                    onChange={handleInputChange}
                    placeholder="Enter your username"
                    className="form-input"
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="password" className="form-label">Password*</label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Type Password"
                  className="form-input"
                  required
                />
              </div>

              <div className="form-options">
                <label className="checkbox-label">
                  <input
                    type="checkbox"
                    name="rememberMe"
                    checked={formData.rememberMe}
                    onChange={handleInputChange}
                    className="checkbox-input"
                  />
                  <span className="checkbox-text">Remember me</span>
                </label>
                <Link to="/forgot-password" className="forgot-password-link">
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="login-button">
                Login
              </button>
            </form>

            {/* Certificate Login */}
            <div className="certificate-login-section">
              <p className="or-divider">OR</p>
              <label htmlFor="certificate-upload" className="form-label">Login with Certificate</label>
              <input
                type="file"
                onChange={handleCertUpload}
                accept=".pfx"
                className="form-input"
              />
              <button onClick={handleCertLogin} className="login-button">
                Login with Certificate
              </button>
            </div>

            <div className="signup-section">
              <span className="signup-text">Don't have an account? </span>
              <Link to="/signup" className="signup-link">Sign Up</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
