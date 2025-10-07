import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignupSuccess.css";

const SignupSuccess = () => {
  const navigate = useNavigate();

  const handleBackToLogin = () => {
    navigate("/login");
  };

  return (
    <div className="signup-success-page">
      <div className="signup-success-card">
        <div className="success-icon-container">
          <svg
            className="success-circle"
            width="129"
            height="129"
            viewBox="0 0 137 137"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g filter="url(#filter0_d_87_838)">
              <circle cx="68.6734" cy="64.6734" r="64.6734" fill="#F2F1EC" />
              <circle
                cx="68.6734"
                cy="64.6734"
                r="64.2211"
                stroke="#36506D"
                strokeWidth="0.904523"
              />
            </g>
            <defs>
              <filter
                id="filter0_d_87_838"
                x="0.38191"
                y="0"
                width="136.583"
                height="136.583"
                filterUnits="userSpaceOnUse"
                colorInterpolationFilters="sRGB"
              >
                <feFlood floodOpacity="0" result="BackgroundImageFix" />
                <feColorMatrix
                  in="SourceAlpha"
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
                  result="hardAlpha"
                />
                <feOffset dy="3.61809" />
                <feGaussianBlur stdDeviation="1.80905" />
                <feComposite in2="hardAlpha" operator="out" />
                <feColorMatrix
                  type="matrix"
                  values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.25 0"
                />
                <feBlend
                  mode="normal"
                  in2="BackgroundImageFix"
                  result="effect1_dropShadow_87_838"
                />
                <feBlend
                  mode="normal"
                  in="SourceGraphic"
                  in2="effect1_dropShadow_87_838"
                  result="shape"
                />
              </filter>
            </defs>
          </svg>
          <svg
            className="success-checkmark"
            width="41"
            height="27"
            viewBox="0 0 47 34"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M3.32178 17.1255L16.8934 30.6933L44.0253 3.55762"
              stroke="#36506D"
              strokeWidth="5.42714"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>

        <div className="success-message">
          <h1 className="success-title">Your Account Has Been Registered</h1>
          <p className="success-subtitle">
            Please Wait for CyberBrief Admins to Authorize Your Account
          </p>
        </div>

        <button className="back-to-login-btn" onClick={handleBackToLogin}>
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default SignupSuccess;
