import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./SignUpEmployee.css";

const SignUpEmployee = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    name: "",
    employeeId: "",
    email: "",
    password: "",
    agreeToTerms: false,
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const validatePassword = (password) => {
    const hasMinLength = password.length >= 8;
    const hasNumberOrSymbol = /[0-9!@#$%^&*(),.?":{}|<>]/.test(password);
    const containsNameOrEmail =
      (formData.name &&
        password.toLowerCase().includes(formData.name.toLowerCase())) ||
      (formData.email &&
        password.toLowerCase().includes(formData.email.toLowerCase()));

    return {
      minLength: hasMinLength,
      numberOrSymbol: hasNumberOrSymbol,
      noNameOrEmail: !containsNameOrEmail,
      strength:
        hasMinLength && hasNumberOrSymbol && !containsNameOrEmail
          ? "Strong"
          : "Weak",
    };
  };

  const passwordValidation = validatePassword(formData.password);

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!formData.agreeToTerms) {
    alert("Please agree to the terms and conditions");
    return;
  }

  if (passwordValidation.strength === "Weak") {
    alert("Please ensure your password meets all requirements");
    return;
  }

  try {
    const response = await fetch("http://localhost:5000/api/signup", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        username: formData.name,  // backend expects "username"
        email: formData.email,
        password: formData.password
      })
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Signup failed");
    }

    console.log("✅ Signup successful:", data);
    navigate("/signup-success");
  } catch (err) {
    console.error("❌ Signup error:", err.message);
    alert(err.message);
  }
};


  const handleBackClick = () => {
    navigate(-1);
  };

  return (
    <div className="signup-employee-container">
      <div className="signup-employee-background">
        <div className="signup-employee-form-container">
          <div className="signup-employee-header">
            <button
              className="back-button"
              onClick={handleBackClick}
              aria-label="Go back"
            >
              <svg
                width="21"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M15 18L9 12L15 6"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
            <h1 className="signup-employee-title">
              Sign Up As An Authorized Employee
            </h1>
          </div>

          <p className="signup-employee-subtitle">
            Enter Details Below For Authorization
          </p>

          <form onSubmit={handleSubmit} className="signup-employee-form">
            <div className="form-group">
              <label htmlFor="name" className="form-label">
                Username*
              </label>
              <input
                type="text"
                id="name"
                name="name"
                value={formData.name}
                onChange={handleInputChange}
                placeholder="Enter your name"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="employeeId" className="form-label">
                Employee ID*
              </label>
              <input
                type="text"
                id="employeeId"
                name="employeeId"
                value={formData.employeeId}
                onChange={handleInputChange}
                placeholder="Enter your employee ID"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="email" className="form-label">
                Email address*
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                placeholder="Enter email address"
                className="form-input"
                required
              />
            </div>

            <div className="form-group">
              <label htmlFor="password" className="form-label">
                Create password*
              </label>
              <div className="password-input-container">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter password"
                  className="form-input password-input"
                  required
                />
                <button
                  type="button"
                  className="password-toggle"
                  onClick={togglePasswordVisibility}
                >
                  Show
                </button>
              </div>
            </div>

            {formData.password && (
              <div className="password-constraints">
                <div className="constraint-item">
                  <svg
                    className={`constraint-icon ${passwordValidation.strength === "Strong" ? "valid" : ""}`}
                    width="15"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.1656 3.71973L6.42996 10.4554L3.36829 7.39373"
                      stroke="#465FF1"
                      strokeOpacity="0.25"
                      strokeWidth="1.37775"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="constraint-text">
                    Password Strength : {passwordValidation.strength}
                  </span>
                </div>

                <div className="constraint-item">
                  <svg
                    className={`constraint-icon ${passwordValidation.noNameOrEmail ? "valid" : ""}`}
                    width="15"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.1656 3.76367L6.42996 10.4993L3.36829 7.43768"
                      stroke="#465FF1"
                      strokeOpacity="0.25"
                      strokeWidth="1.37775"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="constraint-text">
                    Cannot contain your name or email address
                  </span>
                </div>

                <div className="constraint-item">
                  <svg
                    className={`constraint-icon ${passwordValidation.minLength ? "valid" : ""}`}
                    width="15"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.1656 3.80762L6.42996 10.5433L3.36829 7.48162"
                      stroke="#465FF1"
                      strokeOpacity="0.25"
                      strokeWidth="1.37775"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="constraint-text">At least 8 characters</span>
                </div>

                <div className="constraint-item">
                  <svg
                    className={`constraint-icon ${passwordValidation.numberOrSymbol ? "valid" : ""}`}
                    width="15"
                    height="15"
                    viewBox="0 0 16 15"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M13.1656 3.85156L6.42996 10.5872L3.36829 7.52557"
                      stroke="#465FF1"
                      strokeOpacity="0.25"
                      strokeWidth="1.37775"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <span className="constraint-text">
                    Contains a number or symbol
                  </span>
                </div>
              </div>
            )}

            <div className="terms-checkbox-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  name="agreeToTerms"
                  checked={formData.agreeToTerms}
                  onChange={handleInputChange}
                  className="checkbox-input"
                />
                <span className="checkbox-custom"></span>
                <span className="checkbox-text">
                  I agree to terms & conditions
                </span>
              </label>
            </div>

            <button type="submit" className="register-button">
              Register Account
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUpEmployee;
