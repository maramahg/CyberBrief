import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOutModal } from "../App";
import AdminHeader from "./AdminHeader";
import "./AboutUs.css";
import { useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminAboutUs = () => {
  const navigate = useNavigate();
  const { openSignOutModal } = useSignOutModal();
  const [message, setMessage] = useState("");

  const handleBackToHome = () => {
    navigate("/admin-homepage");
  };

  const handleBrowseReports = () => {
    navigate("/admin-browse-reports");
  };

  const handleSendMessage = () => {
    if (message.trim()) {
      console.log("Message sent:", message);
      setMessage("");
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      handleSendMessage();
    }
  };

    useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
    });
  }, []);

  return (
    <div className="employee-homepage">
      <AdminHeader activeItem="about" />

      {/* Main Content */}
      <main className="about-content">
        {/* Hero Section */}
       <section className="hero-section" data-aos="fade-down">
          <h2 className="hero-title">Secure Operations Center</h2>
          <p className="hero-description">
            CyberBrief is your trusted partner in cybersecurity, providing
            comprehensive security operations center services to protect your
            digital assets and maintain operational excellence.
          </p>
        </section>

        {/* Services Section */}
        <section className="services-section">
          <h3 className="section-title">Our Services</h3>
          <div className="services-grid">
<div className="service-card" data-aos="fade-up">                <h4>24/7 Security Monitoring</h4>
              <p>Continuous threat detection and incident response services</p>
            </div>
<div className="service-card" data-aos="fade-up">                <h4>Threat Intelligence</h4>
              <p>
                Advanced threat analysis and security intelligence reporting
              </p>
            </div>
<div className="service-card" data-aos="fade-up">                <h4>Vulnerability Management</h4>
              <p>Comprehensive vulnerability assessment and remediation</p>
            </div>
<div className="service-card" data-aos="fade-up">                <h4>Compliance Support</h4>
              <p>Regulatory compliance and security framework implementation</p>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default AdminAboutUs;
