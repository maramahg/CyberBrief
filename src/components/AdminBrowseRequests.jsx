import { useNavigate } from "react-router-dom";
import { useSignOutModal } from "../App";
import AdminHeader from "./AdminHeader";
import "./AdminBrowseRequests.css";
import React, { useState, useEffect } from "react";
import AOS from "aos";
import "aos/dist/aos.css";

const AdminBrowseRequests = () => {
  const navigate = useNavigate();
  const { openSignOutModal } = useSignOutModal();
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6; // 3x2 grid

  const [employeeRequests, setEmployeeRequests] = useState([]);

  // Filter employees by username, email, or ID
  const filteredEmployees = employeeRequests.filter(
    (employee) =>
      employee.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      employee.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(employee.id).includes(searchTerm)
  );

  useEffect(() => {
    AOS.init({ duration: 1000, once: true, offset: 50 });
  }, []);

  // Fetch pending users
  useEffect(() => {
    const fetchPendingUsers = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await fetch("http://localhost:5000/api/admin/pending-users", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch");

        setEmployeeRequests(data); // ✅ backend returns an array
      } catch (err) {
        alert("Error fetching pending users: " + err.message);
      }
    };

    fetchPendingUsers();
  }, []);

  // Approve user
  const handleApprove = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/admin/approve/${userId}`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Approval failed");

      alert("User approved successfully");
      window.location.reload();
    } catch (err) {
      alert("Error approving user: " + err.message);
    }
  };

  // Reject user
  const handleReject = async (userId) => {
    try {
      const token = localStorage.getItem("token");

      const response = await fetch(`http://localhost:5000/api/admin/reject/${userId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Rejection failed");

      alert("User rejected and deleted");
      window.location.reload();
    } catch (err) {
      alert("Error rejecting user: " + err.message);
    }
  };

  // Pagination calculations
  const totalPages = Math.ceil(filteredEmployees.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentEmployees = filteredEmployees.slice(startIndex, endIndex);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  // Reset to page 1 when search changes
  React.useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  const EmployeeRequestCard = ({ employee }) => (
    <div className="employee-request-card">
      <div className="employee-info">
        <h3 className="employee-name">{employee.username}</h3>
        <p className="employee-id">ID: {employee.id}</p>
        <p className="employee-email">{employee.email}</p>
      </div>
      <div className="action-buttons">
        <button
          className="action-btn approve-btn"
          onClick={() => handleApprove(employee.id)}
        >
          Approve
        </button>
        <button
          className="action-btn reject-btn"
          onClick={() => handleReject(employee.id)}
        >
          Reject
        </button>
      </div>
    </div>
  );

  return (
    <div className="admin-browse-requests">
      <AdminHeader activeItem="requests" />

      <main className="main-content">
        <div className="page-header-section">
          <h1 className="page-title" data-aos="fade-down">
            Pending Employee Requests
          </h1>
        </div>

        <div className="search-section" data-aos="fade-up" data-aos-delay="100">
          <input
            type="text"
            placeholder="Search"
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* Employee Requests Grid */}
        {filteredEmployees.length > 0 ? (
          <div className="requests-grid">
            {currentEmployees.map((employee, index) => (
              <div data-aos="zoom-in" data-aos-delay={index * 100} key={employee.id}>
                <EmployeeRequestCard employee={employee} />
              </div>
            ))}
          </div>
        ) : searchTerm ? (
          <div className="no-results">
            <p className="no-results-message">
              No matching results found for "{searchTerm}"
            </p>
            <p className="no-results-suggestion">
              Try adjusting your search terms or browse all requests
            </p>
          </div>
        ) : (
          <div className="requests-grid"></div>
        )}

        {/* Pagination */}
        <div className="pagination" data-aos="fade-up" data-aos-delay="300">
          <div className="pagination-controls">
            <button
              className="pagination-btn prev-btn"
              onClick={handlePreviousPage}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            {Array.from({ length: Math.max(totalPages, 1) }, (_, i) => i + 1).map((page) => (
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
              disabled={currentPage === totalPages}
            >
              Next
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminBrowseRequests;
