import React from "react";
import { Link } from "react-router-dom";
import "./PasswordChangeSuccess.css";

const PasswordChangeSuccess = () => {
  return (
    <div className="password-success-container">
      <div className="password-success-content">
        {/* Left side - Branding */}
        <div className="password-success-branding-section">
          <div className="password-success-branding-overlay">
            <h1 className="password-success-brand-title">CyberBrief</h1>
          </div>
        </div>

        {/* Right side - Success Content */}
        <div className="password-success-form-section">
          <div className="password-success-form-content">
            <div className="success-icon-container">
              <svg
                className="success-circle"
                width="129"
                height="129"
                viewBox="0 0 137 137"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <g filter="url(#filter0_d_6_62)">
                  <circle
                    cx="68.6734"
                    cy="64.6734"
                    r="64.6734"
                    fill="#F2F1EC"
                  />
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
                    id="filter0_d_6_62"
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
                      result="effect1_dropShadow_6_62"
                    />
                    <feBlend
                      mode="normal"
                      in="SourceGraphic"
                      in2="effect1_dropShadow_6_62"
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

            <div className="success-message-container">
              <h1 className="success-title">
                Your password has been changed successfully!
              </h1>
              <p className="success-description">
                Your password has been updated, and you can now log in with your
                new credentials
              </p>
            </div>

            <Link to="/login" className="back-to-login-button">
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordChangeSuccess;
