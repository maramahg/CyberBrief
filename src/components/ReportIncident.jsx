import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import Dropdown from "./Dropdown";
import "./ReportIncident.css";
import AOS from "aos";
import "aos/dist/aos.css";

const ReportIncident = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const editingReport = location.state?.editingReport;
  const isEditing = !!editingReport;

  const [formData, setFormData] = useState({
    incidentTitle: "",
    incidentType: "",
    levelOfImportance: "",
    affectedDivision: "",
    status: "",
    incidentDate: "",
    reporterEmail: "",
    description: "",
  });

  useEffect(() => {
  AOS.init({ duration: 1000, once: true, offset: 50 });
}, []);


  // Pre-populate form if editing
  useEffect(() => {
    if (editingReport) {
      setFormData({
        incidentTitle: editingReport.incidentTitle || "",
        incidentType: editingReport.incidentType || "",
        levelOfImportance: editingReport.levelOfImportance || "",
        affectedDivision: editingReport.affectedDivision || "",
        status: editingReport.status || "",
        incidentDate: editingReport.incidentDate || "",
        reporterEmail: editingReport.reporterEmail || "",
        description: editingReport.description || "",
      });
    }
  }, [editingReport]);

  const incidentTypeOptions = [
    "Malware Detection",
    "Security Breach",
    "Unauthorized Access",
    "Phishing Attack",
    "Data Leak",
    "System Compromise",
    "Network Intrusion",
    "Suspicious Activity",
    "DDoS Attack",
    "Vulnerability Report",
  ];

  const importanceOptions = ["Critical", "High", "Medium", "Low"];

  const divisionOptions = [
    "IT Department",
    "Security Team",
    "Operations",
    "Management",
    "Human Resources",
  ];

  const statusOptions = [
    "Open",
    "In Progress",
    "Under Investigation",
    "Resolved",
    "Closed",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

const handleSubmit = (e) => {
  e.preventDefault();

  const url = isEditing
    ? `http://localhost:5000/api/incidents/${editingReport.id}`
    : "http://localhost:5000/api/incidents";

  const method = isEditing ? "PUT" : "POST";

  console.log(`📤 ${isEditing ? 'Updating' : 'Submitting'} incident report...`);

  fetch(url, {
    method: method,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    },
    body: JSON.stringify(formData),
  })
    .then((res) => {
      console.log("📥 Raw response:", res);
      return res.json();
    })
    .then((data) => {
      console.log(`✅ Incident ${isEditing ? 'updated' : 'submitted'}:`, data);
      alert(`Incident ${isEditing ? 'updated' : 'submitted'} successfully!`);
      navigate("/admin-browse-reports");
    })
    .catch((err) => {
      console.error(`❌ ${isEditing ? 'Update' : 'Submission'} error:`, err);
      alert(`Failed to ${isEditing ? 'update' : 'submit'} incident.`);
    });

  console.log("🧪 Final Form Data:", formData);
  console.log("🧪 Token:", localStorage.getItem("token"));
};



  const handleBack = () => {
    navigate(-1);
  };

  return (
    <div className="report-incident">
      <AdminHeader activeItem="report" />

      <div className="report-incident-container">
        <div className="report-form-wrapper">
          {/* Back Navigation */}
          <div className="back-navigation" onClick={handleBack}>
            <svg
              className="back-arrow"
              width="10"
              height="12"
              viewBox="0 0 10 12"
              fill="none"
            >
              <path
                d="M10 1.47531L8.47472 0.482422L0 6.03585L8.48329 11.5893L10 10.5964L3.03342 6.03585L10 1.47531Z"
                fill="#8692A6"
              />
            </svg>
            <span className="back-text">Back</span>
          </div>

          {/* Page Title */}
          <h1 className="page-title" data-aos="fade-down">{isEditing ? 'Edit Incident Report' : 'Report Incident'}</h1>

          {/* Form Section */}
          <div className="form-section">
            <h2 className="section-title" data-aos="fade-up">Incident Details</h2>

            <form onSubmit={handleSubmit} className="incident-form">
              {/* Row 1: Incident Title */}
             <div className="form-row" data-aos="fade-up" data-aos-delay="100">
                <div className="input-group full-width">
                  <label className="input-label">Incident Title*</label>
                  <input
                    type="text"
                    className="text-input"
                    placeholder="Type incident title"
                    value={formData.incidentTitle}
                    onChange={(e) =>
                      handleInputChange("incidentTitle", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Row 2: Incident Type and Level of Importance */}
              <div className="form-row" data-aos="fade-up" data-aos-delay="200">
                <div className="input-group">
                  <label className="input-label">Incident Type*</label>
                  <Dropdown
                    options={incidentTypeOptions}
                    placeholder="Select"
                    selectedValue={formData.incidentType}
                    onSelect={(value) =>
                      handleInputChange("incidentType", value)
                    }
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Level of Importance*</label>
                  <Dropdown
                    options={importanceOptions}
                    placeholder="Select"
                    selectedValue={formData.levelOfImportance}
                    onSelect={(value) =>
                      handleInputChange("levelOfImportance", value)
                    }
                  />
                </div>
              </div>

              {/* Row 3: Affected Division and Incident Date */}
              <div className="form-row" data-aos="fade-up" data-aos-delay="300">
                <div className="input-group">
                  <label className="input-label">Affected Division*</label>
                  <Dropdown
                    options={divisionOptions}
                    placeholder="Select"
                    selectedValue={formData.affectedDivision}
                    onSelect={(value) =>
                      handleInputChange("affectedDivision", value)
                    }
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Incident Date*</label>
                  <input
                    type="date"
                    className="text-input date-input"
                    value={formData.incidentDate}
                    onChange={(e) =>
                      handleInputChange("incidentDate", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Row 4: Status and Reporter Email */}
              <div className="form-row" data-aos="fade-up" data-aos-delay="400">
                <div className="input-group">
                  <label className="input-label">Status*</label>
                  <Dropdown
                    options={statusOptions}
                    placeholder="Select"
                    selectedValue={formData.status}
                    onSelect={(value) => handleInputChange("status", value)}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Reporter Email*</label>
                  <input
                    type="email"
                    className="text-input"
                    placeholder="Type incident title"
                    value={formData.reporterEmail}
                    onChange={(e) =>
                      handleInputChange("reporterEmail", e.target.value)
                    }
                    required
                  />
                </div>
              </div>

              {/* Row 5: Description */}
              <div className="form-row" data-aos="fade-up" data-aos-delay="500">
                <div className="input-group full-width">
                  <label className="input-label">Description*</label>
                  <textarea
                    className="textarea-input"
                    placeholder="Describe the incident in detail..."
                    value={formData.description}
                    onChange={(e) =>
                      handleInputChange("description", e.target.value)
                    }
                    required
                    rows={8}
                  />
                </div>
              </div>

              {/* Submit Button */}
              <div className="submit-section" data-aos="fade-up" data-aos-delay="500">
                <button type="submit" className="submit-button">
                  {isEditing ? 'Update Report' : 'Post'}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportIncident;
