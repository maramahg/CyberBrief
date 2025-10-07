import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOutModal } from "../App";
import "./AboutUs.css";
import AOS from "aos";
import "aos/dist/aos.css";

const AboutUs = () => {
  const navigate = useNavigate();
  const { openSignOutModal } = useSignOutModal();
  const [message, setMessage] = useState("");

  const handleBackToHome = () => navigate("/employee-homepage");
  const handleBrowseReports = () => navigate("/browse-reports");
  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") handleSendMessage();
  };

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });
  }, []);

  return (
    <div className="employee-homepage">
      <header className="main-header">
        <div className="header-container">
          <div className="brand-section">
            <h1 className="brand-title" onClick={handleBackToHome} style={{ cursor: "pointer" }}>
              CyberBrief
            </h1>
          </div>
          <nav className="main-navigation">
            <button className="nav-item" onClick={handleBackToHome}>Home</button>
            <button className="nav-item" onClick={handleBrowseReports}>Browse Daily Reports</button>
            <button className="nav-item active">About us</button>
            <button className="nav-item sign-out-btn" onClick={openSignOutModal}>Sign out</button>
          </nav>
        </div>
      </header>

      <main className="about-content">
        <section className="hero-section" data-aos="fade-down">
          <h2 className="hero-title">Secure Operations Center</h2>
          <p className="hero-description">
            CyberBrief is your trusted partner in cybersecurity, providing
            comprehensive security operations center services to protect your
            digital assets and maintain operational excellence.
          </p>
        </section>

        <section className="services-section">
          <h3 className="section-title" data-aos="fade-up">Our Services</h3>
          <div className="services-grid">
            <div className="service-card" data-aos="fade-up">
              <h4>24/7 Security Monitoring</h4>
              <p>Continuous threat detection and incident response services</p>
            </div>
            <div className="service-card" data-aos="fade-up">
              <h4>Threat Intelligence</h4>
              <p>Advanced threat analysis and security intelligence reporting</p>
            </div>
            <div className="service-card" data-aos="fade-up">
              <h4>Vulnerability Management</h4>
              <p>Comprehensive vulnerability assessment and remediation</p>
            </div>
            <div className="service-card" data-aos="fade-up">
              <h4>Compliance Support</h4>
              <p>Regulatory compliance and security framework implementation</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AboutUs;
