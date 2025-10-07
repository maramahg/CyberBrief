import React, { useState } from "react";
import { useLocation } from "react-router-dom";
import AdminHeader from "./AdminHeader";
import "./EventDetails.css";

const AdminEventDetails = () => {

  const { state } = useLocation();
const report = state?.report;
  const [message, setMessage] = useState("");

if (!report) {
  return <div>⚠️ No report data found.</div>;
}


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

  return (
    <div className="event-details-page">
      <AdminHeader />
      {/* Browser Window with Report Content */}
      <div className="browser-container">
        <div className="browser-window">
          <div className="window-frame">
            <div className="report-content">
              <header className="report-header">
                <h1 className="report-title">{report.incidentTitle}</h1>
                <div className="report-meta">
                  <span className="published-by">
                   	Published by: {report.reporterEmail}
                  </span>
                </div>
              </header>

              <div className="report-details">
                <div className="report-fields">
                  <div className="field-row">
                    <div className="field-item">
                      <label className="field-label">Type:</label>
                      <span className="field-value">{report.incidentType}</span>                    </div>
                    <div className="field-item">
                      <label className="field-label">
                        Level of Importance:
                      </label>
                        <span className="field-value">{report.levelOfImportance}</span>                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field-item">
                      <label className="field-label">Affected Division:</label>
                      <span className="field-value">{report.affectedDivision}</span>
                    </div>
                    <div className="field-item">
                      <label className="field-label">Date:</label>
                        <span className="field-value">{report.incidentDate}</span>                    </div>
                  </div>

                  <div className="field-row">
                    <div className="field-item">
                      <label className="field-label">Status:</label>
                      <span className="field-value">{report.status}</span>
                    </div>
                    <div className="field-item">
                      <label className="field-label">Contact Reporter:</label>
                      <span className="field-value">{report.reporterEmail}</span>
                    </div>
                  </div>
                </div>

                <div className="report-description">
                  <h3 className="description-title">Description</h3>
                 <p className="description-text">{report.description}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminEventDetails;
