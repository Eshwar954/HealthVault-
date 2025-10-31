import React, { useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // normalize role
  const rawRole = localStorage.getItem("role");
  const role = (rawRole || "").toLowerCase().trim();
  const isLoggedIn = !!role;

  // redirect once from "/" only
  useEffect(() => {
    if (location.pathname === "/" && !sessionStorage.getItem("redirected")) {
      if (role === "user") navigate("/user/dashboard");
      else if (role === "doctor") navigate("/doctor/dashboard");
      else if (role === "diagnostic center" || role === "diagnostic")
        navigate("/diagnostic/dashboard");
      sessionStorage.setItem("redirected", "true");
    }
  }, [role, navigate, location.pathname]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("redirected");
    navigate("/");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar navbar-expand-lg bg-light app-navbar">
      <div className="container px-5">
        {/* Brand */}
        <Link to="/" className="navbar-brand">HealthVault</Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#hvNav"
          aria-controls="hvNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Center links */}
        <div className="collapse navbar-collapse justify-content-center" id="hvNav">
          <ul className="navbar-nav">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/" className={`nav-link ${isActive("/")}`}>Home</Link>
                </li>
                <li className="nav-item">
                  <a href="/#features" className="nav-link">Features</a>
                </li>
                <li className="nav-item">
                  <a href="/#how" className="nav-link">How it works</a>
                </li>
                <li className="nav-item">
                  <a href="/#faq" className="nav-link">FAQ</a>
                </li>
              </>
            ) : role === "user" ? (
              <>
                <li className="nav-item">
                  <Link to="/user/dashboard" className={`nav-link ${isActive("/user/dashboard")}`}>Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/uploads" className={`nav-link ${isActive("/user/uploads")}`}>Uploads</Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/files" className={`nav-link ${isActive("/user/files")}`}>Files</Link>
                </li>
              </>
            ) : role === "doctor" ? (
              <>
                <li className="nav-item">
                  <Link to="/doctor/dashboard" className={`nav-link ${isActive("/doctor/dashboard")}`}>Doctor Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/requestaccess" className={`nav-link ${isActive("/requestaccess")}`}>Request Access</Link>
                </li>
              </>
            ) : role === "diagnostic center" || role === "diagnostic" ? (
              <>
                <li className="nav-item">
                  <Link to="/diagnostic/dashboard" className={`nav-link ${isActive("/diagnostic/dashboard")}`}>Diagnostic Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/diagnostic/upload" className={`nav-link ${isActive("/diagnostic/upload")}`}>Upload Reports</Link>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        {/* Right: auth */}
        <div className="nav-item dropdown">
          {isLoggedIn ? (
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <div className="dropdown">
              <button
                className="btn login-btn dropdown-toggle"
                id="loginDropdown"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                Login
              </button>
              <ul className="dropdown-menu" aria-labelledby="loginDropdown">
                <li><Link to="/UserLogin" className="dropdown-item">User Login</Link></li>
                <li><Link to="/DoctorLogin" className="dropdown-item">Doctor Login</Link></li>
                <li><Link to="/DiagnosticLogin" className="dropdown-item">Diagnostic Center Login</Link></li>
              </ul>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
