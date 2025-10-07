import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useSignOutModal } from "../App";
import Header from "./Header";
import "./BrowseReports.css";
import AOS from "aos";
import "aos/dist/aos.css";


const BrowseReports = () => {
  const navigate = useNavigate();
  const { openSignOutModal } = useSignOutModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;


  const handleViewEventDetails = () => {
    navigate("/event-details");
  };

  const handleHome = () => {
    navigate("/employee-homepage");
  };

  const handleAboutUs = () => {
    navigate("/about-us");
  };

  const handleSignOut = () => {
    openSignOutModal();
  };

  const [reportData, setReportData] = useState([]);
const [loading, setLoading] = useState(true);

useEffect(() => {
  AOS.init({ duration: 1000, once: true , offset: 50});
}, []);


useEffect(() => {

  fetch("http://localhost:5000/api/incidents", {
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`, // include token if route is protected
    },
  })
    .then((res) => res.json())

  .then((data) => {
  setReportData(data); // ✅ This is the actual array
  setLoading(false);
})


    .catch((err) => {
      console.error("Failed to fetch reports:", err);
      setLoading(false);
    });
}, []);


  // Filter reports based on search term
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


  // Pagination calculations
  const totalPages = Math.ceil(filteredReports.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentReports = filteredReports.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    setCurrentPage(currentPage + 1);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);



  const ReportCard = ({ report }) => (
    <div className="report-card">
      <div className="report-content">
        <div className="report-text-content">
          <h3 className="report-title">{report?.incidentTitle}</h3>
          <p className="report-date">{report?.incidentDate}</p>
          <p className="report-member">{report?.reporterEmail}</p>
        </div>
        <button className="view-details-btn" onClick={() => navigate("/event-details", { state: { report } })}>
          View Details
        </button>
      </div>
    </div>
  );

  return (
    <div className="browse-reports">
      <Header activeItem="browse" />

      {/* Main Content */}
      <main className="main-content">
        <div className="content-header">
          <div className="header-text" data-aos="fade-down">
            <span className="section-tag">Find CyberBrief Reports</span>
            <h2 className="page-title">
              Explore all CyberBrief daily reports with a click.
            </h2>
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

            {/* Reports Grid */}
                        {loading ? (
              <p>Loading reports...</p>
            ) : filteredReports.length > 0 ? (
              <div className="reports-grid">
                {currentReports.map((report, index) => (
                  <div key={report.id} data-aos="fade-up" data-aos-delay={index * 100}>
                  <ReportCard key={report.id} report={report} />
                  </div>
                ))}
              </div>
            ) : searchTerm ? (
              <div className="no-results">
                <p className="no-results-message">
                  No matching results found for "{searchTerm}"
                </p>
                <p className="no-results-suggestion">
                  Try adjusting your search terms or browse all reports
                </p>
              </div>
            ) : (
              <p>No reports have been uploaded yet.</p>
            )}


            {/* Pagination */}
            <div className="pagination" data-aos="fade-up">
              <button
                className="pagination-btn prev-btn"
                onClick={handlePreviousPage}
                disabled={currentPage === 1}
              >
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M5.66393 8.67199C5.49519 8.50321 5.40039 8.27432 5.40039 8.03566C5.40039 7.79699 5.49519 7.5681 5.66393 7.39932L9.19727 3.86599C9.2804 3.78049 9.37969 3.71236 9.48938 3.66557C9.59907 3.61877 9.71697 3.59424 9.83622 3.59341C9.95547 3.59257 10.0737 3.61544 10.184 3.66069C10.2944 3.70594 10.3946 3.77266 10.4789 3.85699C10.5633 3.94131 10.63 4.04156 10.6752 4.15189C10.7205 4.26223 10.7434 4.38045 10.7425 4.4997C10.7417 4.61895 10.7171 4.73685 10.6704 4.84654C10.6236 4.95623 10.5554 5.05552 10.4699 5.13866L7.5726 8.03599L10.4719 10.9353C10.6368 11.1049 10.7283 11.3325 10.7266 11.569C10.725 11.8055 10.6303 12.0319 10.4631 12.1991C10.2958 12.3663 10.0695 12.461 9.83298 12.4627C9.59648 12.4644 9.36883 12.3729 9.19927 12.208L5.66393 8.67199Z"
                    fill="#6F7373"
                  />
                </svg>
                Previous
              </button>
              {Array.from(
                { length: Math.max(totalPages, 1) },
                (_, i) => i + 1,
              ).map((page) => (
                <span
                  key={page}
                  className={`page-number ${currentPage === page ? "active" : ""}`}
                  onClick={() => handlePageChange(page)}
                >
                  {page}
                </span>
              ))}
              <button
                className="pagination-btn next-btn"
                onClick={handleNextPage}
              >
                Next
                <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
                  <path
                    d="M10.3361 7.32801C10.5048 7.49679 10.5996 7.72568 10.5996 7.96434C10.5996 8.20301 10.5048 8.4319 10.3361 8.60068L6.80273 12.134C6.7196 12.2195 6.62031 12.2876 6.51062 12.3344C6.40093 12.3812 6.28303 12.4058 6.16378 12.4066C6.04453 12.4074 5.9263 12.3846 5.81597 12.3393C5.70563 12.2941 5.60539 12.2273 5.52107 12.143C5.43674 12.0587 5.37001 11.9584 5.32477 11.8481C5.27952 11.7378 5.25665 11.6195 5.25748 11.5003C5.25832 11.381 5.28285 11.2632 5.32964 11.1535C5.37644 11.0438 5.44457 10.9445 5.53007 10.8613L8.4274 7.96401L5.52807 5.06468C5.3632 4.89511 5.2717 4.66746 5.27336 4.43096C5.27502 4.19446 5.36971 3.96812 5.53694 3.80089C5.70418 3.63365 5.93052 3.53897 6.16702 3.5373C6.40352 3.53564 6.63117 3.62714 6.80073 3.79201L10.3361 7.32801Z"
                    fill="black"
                  />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default BrowseReports;
