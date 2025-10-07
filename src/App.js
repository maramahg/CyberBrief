import React, { useState, createContext, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from "react-router-dom";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import PasswordChangeSuccess from "./components/PasswordChangeSuccess";
import EmployeeHomepage from "./components/EmployeeHomepage";
import AdminHomepage from "./components/AdminHomepage";
import AboutUs from "./components/AboutUs";
import AdminAboutUs from "./components/AdminAboutUs";
import BrowseReports from "./components/BrowseReports";
import AdminBrowseReports from "./components/AdminBrowseReports";
import AdminBrowseRequests from "./components/AdminBrowseRequests";
import EventDetails from "./components/EventDetails";
import AdminEventDetails from "./components/AdminEventDetails";
import ReportIncident from "./components/ReportIncident";
import SignOutModal from "./components/SignOutModal";
import SignUpEmployee from "./components/SignUpEmployee";
import SignupSuccess from "./components/SignupSuccess";
import ResetPassword from "./components/ResetPassword";

// Create context for sign-out modal
const SignOutModalContext = createContext();

export const useSignOutModal = () => {
  const context = useContext(SignOutModalContext);
  if (!context) {
    throw new Error("useSignOutModal must be used within SignOutModalProvider");
  }
  return context;
};

// Create context for user type
const UserTypeContext = createContext();

export const useUserType = () => {
  const context = useContext(UserTypeContext);
  if (!context) {
    throw new Error("useUserType must be used within UserTypeProvider");
  }
  return context;
};

function AppContent() {
  const [isSignOutModalOpen, setIsSignOutModalOpen] = useState(false);
  const location = useLocation();

  const openSignOutModal = () => setIsSignOutModalOpen(true);
  const closeSignOutModal = () => setIsSignOutModalOpen(false);

  // Determine user type based on current URL
  const isAdminPage = location.pathname.startsWith("/admin-");
  const homePageUrl = isAdminPage ? "/admin-homepage" : "/employee-homepage";
  console.log(
    "Current path:",
    location.pathname,
    "isAdminPage:",
    isAdminPage,
    "homePageUrl:",
    homePageUrl,
  );

  return (
    <UserTypeContext.Provider value={{ isAdminPage }}>
      <SignOutModalContext.Provider
        value={{ openSignOutModal, closeSignOutModal }}
      >
        <div className="App">
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<SignUpEmployee />} />
            <Route path="/signup-employee" element={<SignUpEmployee />} />
            <Route path="/signup-success" element={<SignupSuccess />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password" element={<ResetPassword />} />
            <Route path="/password-changed" element={<PasswordChangeSuccess />} />
            <Route path="/employee-homepage" element={<EmployeeHomepage />} />
            <Route path="/admin-homepage" element={<AdminHomepage />} />
            <Route path="/browse-reports" element={<BrowseReports />} />
            <Route
              path="/admin-browse-reports"
              element={<AdminBrowseReports />}
            />
            <Route
              path="/admin-browse-requests"
              element={<AdminBrowseRequests />}
            />
            <Route path="/about-us" element={<AboutUs />} />
            <Route path="/admin-about-us" element={<AdminAboutUs />} />
            <Route path="/event-details" element={<EventDetails />} />
            <Route
              path="/admin-event-details"
              element={<AdminEventDetails />}
            />
            <Route path="/report-incident" element={<ReportIncident />} />
          </Routes>
          <SignOutModal
            isOpen={isSignOutModalOpen}
            onClose={closeSignOutModal}
            homePageUrl={homePageUrl}
          />
        </div>
      </SignOutModalContext.Provider>
    </UserTypeContext.Provider>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
