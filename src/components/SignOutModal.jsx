import React from "react";
import { useNavigate } from "react-router-dom";
import "./SignOutModal.css";

const SignOutModal = ({
  isOpen,
  onClose,
  homePageUrl = "/employee-homepage",
}) => {
  const navigate = useNavigate();

  const handleSignOut = () => {
    // Handle actual sign out logic here
    navigate("/login");
    onClose();
  };

  const handleBackToHome = () => {
    console.log("Back to home clicked, homePageUrl:", homePageUrl);
    navigate(homePageUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <h3 className="modal-title">Are you sure you want to sign out ?</h3>

        <button className="sign-out-button" onClick={handleSignOut}>
          Sign out
        </button>

        <p className="back-to-home-text">
          <span className="changed-mind-text">Changed your mind?</span>
          <span className="back-link" onClick={handleBackToHome}>
            {" "}
            Back to home
          </span>
        </p>
      </div>
    </div>
  );
};

export default SignOutModal;
