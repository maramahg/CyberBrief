import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import RecentReports from "./RecentReports";
import "./EmployeeHomepage.css";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminHomepage = () => {
  const navigate = useNavigate();

  const handleBrowseReports = () => {
    navigate("/admin-browse-reports");
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="employee-homepage">
      <AdminHeader activeItem="home" />

      <section className="hero-section">
        <div className="hero-container">
          <div className="hero-content">
            <h2 className="hero-title" data-aos="fade-right">
              <span className="title-dark">Secure Reporting, Trusted</span>
              <br />
              <span className="title-dark">Access,</span>
              <br />
              <span className="title-light">Total Control.</span>
            </h2>
            <p className="hero-subtitle" data-aos="fade-left">
              Protecting What Matters, One Secure Report at a Time.
            </p>
            <button className="cta-button" onClick={handleBrowseReports} data-aos="zoom-in">
              Browse Daily Reports
            </button>
          </div>
        </div>
      </section>

      <section className="trust-section" data-aos="fade-up">
        <div className="trust-container">
          <p className="trust-text">Trusted by Leading Companies Across the Middle East</p>
          <div className="company-logos">
            <div className="logo-placeholder">aramco</div>
          </div>
        </div>
      </section>

      <RecentReports isAdmin={true} data-aos="fade-up" />
    </div>
  );
};

export default AdminHomepage;
