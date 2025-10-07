import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOutModal } from "../App";
import AdminHeader from "./AdminHeader";
import "./BrowseReports.css";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminBrowseReports = () => {
  const navigate = useNavigate();
  const { openSignOutModal } = useSignOutModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  const [reportData, setReportData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true , offset: 50});
  }, []);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/incidents", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        });
        const data = await response.json();
        setReportData(data);
      } catch (err) {
        console.error("Failed to fetch reports:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchReports();
  }, []);

  const handleViewEventDetails = (report) => {
    navigate("/admin-event-details", { state: { report } });
  };

  const handleEditReport = (report) => {
    navigate("/report-incident", { state: { editingReport: report } });
  };

  const handleDeleteReport = async (reportId) => {
    if (!window.confirm("Are you sure you want to delete this report?")) return;

    try {
      const response = await fetch(`http://localhost:5000/api/incidents/${reportId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (response.ok) {
        setReportData((prev) => prev.filter((r) => r.id !== reportId));
        alert("Report deleted successfully.");
      } else {
        alert("Failed to delete the report.");
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      alert("An error occurred while deleting the report.");
    }
  };

  const filteredReports = Array.isArray(reportData)
  ? reportData
      .slice()
      .sort((a, b) => new Date(b.incidentDate) - new Date(a.incidentDate))
      .filter(
        (report) =>
          report.incidentTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.reporterEmail?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          report.incidentDate?.toLowerCase().includes(searchTerm.toLowerCase())
      )
  : [];

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handlePreviousPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const ReportCard = ({ report }) => (
    <div className="report-card">
      <div className="report-content">
        <div className="report-text-content">
          <h3 className="report-title">{report.incidentTitle}</h3>
          <p className="report-date">{report.incidentDate}</p>
          <p className="report-member">{report.reporterEmail}</p>
        </div>
        <div className="report-actions">
          <button className="view-details-btn" onClick={() => handleViewEventDetails(report)}>
            View Details
          </button>
          <div className="admin-actions">
            <button className="edit-btn" onClick={() => handleEditReport(report)} title="Edit Report">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M11.334 2.00004C11.7024 1.63166 12.2012 1.42334 12.7207 1.42334C13.2401 1.42334 13.7389 1.63166 14.1073 2.00004C14.4757 2.36842 14.684 2.86717 14.684 3.38671C14.684 3.90624 14.4757 4.405 14.1073 4.77337L5.16065 13.72L1.33398 14.6667L2.28065 10.84L11.334 2.00004Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <button className="delete-btn" onClick={() => handleDeleteReport(report.id)} title="Delete Report">
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                <path d="M2 4h12M5.333 4V2.667a1.333 1.333 0 0 1 1.334-1.334h2.666a1.333 1.333 0 0 1 1.334 1.334V4m2 0v9.333a1.333 1.333 0 0 1-1.334 1.334H4.667a1.333 1.333 0 0 1-1.334-1.334V4h8.667Z" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M6.666 7.333v4M9.333 7.333v4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="browse-reports">
      <AdminHeader activeItem="browse" />

      <main className="main-content">
        <div className="content-header">
        <div className="header-text" data-aos="fade-down">
            <span className="section-tag">Find CyberBrief Reports</span>
            <h2 className="page-title">Explore all CyberBrief daily reports with a click.</h2>
          </div>
        </div>

        <div className="content-layout">
          <div className="content-area">
            <div className="search-section" data-aos="fade-up">
              <input
                type="text"
                placeholder="Search"
                className="search-input"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {loading ? (
              <p>Loading reports...</p>
            ) : currentReports.length > 0 ? (
               <div className="reports-grid">
                {currentReports.map((report, index) => (
                  <div key={report.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <ReportCard key={report.id} report={report} />
                  </div>
                ))}
              </div>
            ) : filteredReports.length === 0 && currentPage === 1 ? (
              <div className="no-results">
                <p>No matching reports found.</p>
              </div>
            ) : (
              <div className="blank-page">
                {/* Blank page - no content */}
              </div>
            )}

            <div className="pagination" data-aos="fade-up">
              <button className="pagination-btn" onClick={handlePreviousPage} disabled={currentPage === 1}>
                Previous
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                <span
                  key={page}
                  className={`page-number ${currentPage === page ? "active" : ""}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </span>
              ))}
              <button className="pagination-btn" onClick={handleNextPage}>
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminBrowseReports;
