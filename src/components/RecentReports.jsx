import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const RecentReports = ({ isAdmin = false }) => {
  const navigate = useNavigate();
  const [recentReports, setRecentReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecentReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/incidents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();

        // Sort by date (most recent first) and take only the first 4
        const sortedReports = data
          .sort((a, b) => new Date(b.incidentDate) - new Date(a.incidentDate))
          .slice(0, 4);

        setRecentReports(sortedReports);
      } catch (err) {
        console.error("Failed to fetch recent reports:", err);
        setRecentReports([]);
      } finally {
        setLoading(false);
      }
    };

    fetchRecentReports();
  }, []);

  const handleViewAll = () => {
    if (isAdmin) {
      navigate("/admin-browse-reports");
    } else {
      navigate("/browse-reports");
    }
  };

  const handleViewDetails = (report) => {
    if (isAdmin) {
      navigate("/admin-event-details", { state: { report } });
    } else {
      navigate("/event-details", { state: { report } });
    }
  };

  const formatDate = (dateString) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
      });
    } catch {
      return dateString;
    }
  };

  if (loading) {
    return (
      <section className="recent-events-section">
        <div className="events-container">
          <div className="section-header">
            <div className="header-left">
              <span className="section-tag">Recent Events</span>
              <h2 className="section-title">Explore Recent Daily Report:</h2>
            </div>
          </div>
          <p>Loading recent reports...</p>
        </div>
      </section>
    );
  }

  return (
    <section className="recent-events-section">
      <div className="events-container">
        <div className="section-header">
          <div className="header-left">
            <span className="section-tag">Recent Events</span>
            <h2 className="section-title">Explore Recent Daily Report:</h2>
          </div>
          <button className="view-all-btn" onClick={handleViewAll}>
            All
          </button>
        </div>

        {recentReports.length > 0 ? (
          <div className="reports-grid">
            {recentReports.map((report, index) => (
              <div key={report.id} className="report-card">
                <div className="report-content">
                  <div className="report-text-content">
                    {index === 0 && (
                      <div className="latest-badge">
                        <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                          <circle cx="8" cy="8" r="8" fill="#2c5568"/>
                          <circle cx="8" cy="8" r="3" fill="white"/>
                        </svg>
                        Latest
                      </div>
                    )}
                    <h4 className="report-title">{report.incidentTitle}</h4>
                    <p className="report-date">{formatDate(report.incidentDate)}</p>
                    <p className="report-member">CyberBrief Member #{report.reporterEmail?.split('@')[0] || 'Unknown'}</p>
                  </div>
                  <button
                    className="report-view-btn"
                    onClick={() => handleViewDetails(report)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="no-reports">
            <p className="no-reports-message">No reports available yet.</p>
            <p className="no-reports-subtitle">Recent reports will appear here once they are submitted.</p>
          </div>
        )}
      </div>
    </section>
  );
};

export default RecentReports;
