import React from "react";
import { useNavigate } from "react-router-dom";
import { useSignOutModal } from "../App";
import "./Header.css";

const AdminHeader = ({ activeItem = "" }) => {
  const navigate = useNavigate();
  const { openSignOutModal } = useSignOutModal();

  const handleHome = () => {
    navigate("/admin-homepage");
  };

  const handleReportIncident = () => {
    // Navigate to report incident page (placeholder for now)
    navigate("/report-incident");
  };

  const handleBrowseReports = () => {
    navigate("/admin-browse-reports");
  };

  const handleBrowseRequests = () => {
    navigate("/admin-browse-requests");
  };

  const handleAboutUs = () => {
    navigate("/admin-about-us");
  };

  const handleSignOut = () => {
    openSignOutModal();
  };

  return (
    <header className="page-header">
      <div className="header-container">
        <h1 className="brand-title" onClick={handleHome}>
          CyberBrief
        </h1>
        <nav className="main-navigation">
          <button
            className={`nav-item ${activeItem === "home" ? "active" : ""}`}
            onClick={handleHome}
          >
            Home
          </button>
          <button
            className={`nav-item ${activeItem === "browse" ? "active" : ""}`}
            onClick={handleBrowseReports}
          >
            Browse Daily Reports
          </button>
          <button
            className={`nav-item ${activeItem === "report" ? "active" : ""}`}
            onClick={handleReportIncident}
          >
            Report Incident
          </button>
          <button
            className={`nav-item ${activeItem === "requests" ? "active" : ""}`}
            onClick={handleBrowseRequests}
          >
            Browse Requests
          </button>
          <button
            className={`nav-item ${activeItem === "about" ? "active" : ""}`}
            onClick={handleAboutUs}
          >
            About us
          </button>
          <button className="nav-item sign-out-btn" onClick={handleSignOut}>
            Sign out
          </button>
        </nav>
      </div>
    </header>
  );
};

export default AdminHeader;
