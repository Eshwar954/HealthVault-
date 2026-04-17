import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);

  // normalize role
  const rawRole = localStorage.getItem("role");
  const role = (rawRole || "").toLowerCase().trim();
  const isLoggedIn = !!role;

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    localStorage.removeItem("loginId");
    sessionStorage.removeItem("redirected");
    setIsNavOpen(false);
    navigate("/");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar navbar-expand-lg bg-white app-navbar border-bottom sticky-top">
      <div className="container">
        {/* Brand */}
        <Link to="/" className="navbar-brand fw-bold text-primary" onClick={() => setIsNavOpen(false)}>
          HealthVault
        </Link>

        {/* Toggler */}
        <button
          className="navbar-toggler border-0 shadow-none"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Links & Auth */}
        <div className={`collapse navbar-collapse ${isNavOpen ? 'show' : ''}`} id="hvNav">
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/" className={`nav-link ${isActive("/")}`} onClick={() => setIsNavOpen(false)}>Home</Link>
                </li>
                <li className="nav-item">
                  <a href="/#features" className="nav-link" onClick={() => setIsNavOpen(false)}>Features</a>
                </li>
                <li className="nav-item">
                  <a href="/#how" className="nav-link" onClick={() => setIsNavOpen(false)}>How it works</a>
                </li>
              </>
            ) : role === "user" ? (
              <>
                <li className="nav-item">
                  <Link to="/user/dashboard" className={`nav-link ${isActive("/user/dashboard")}`} onClick={() => setIsNavOpen(false)}>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/files" className={`nav-link ${isActive("/user/files")}`} onClick={() => setIsNavOpen(false)}>My Files</Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/uploads" className={`nav-link ${isActive("/user/uploads")}`} onClick={() => setIsNavOpen(false)}>Upload</Link>
                </li>
              </>
            ) : role === "doctor" ? (
              <>
                <li className="nav-item">
                  <Link to="/doctor/dashboard" className={`nav-link ${isActive("/doctor/dashboard")}`} onClick={() => setIsNavOpen(false)}>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/requestaccess" className={`nav-link ${isActive("/requestaccess")}`} onClick={() => setIsNavOpen(false)}>Request Access</Link>
                </li>
              </>
            ) : (role === "diagnostic center" || role === "diagnostic") ? (
              <>
                <li className="nav-item">
                  <Link to="/diagnostic/dashboard" className={`nav-link ${isActive("/diagnostic/dashboard")}`} onClick={() => setIsNavOpen(false)}>Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/diagnostic/upload" className={`nav-link ${isActive("/diagnostic/upload")}`} onClick={() => setIsNavOpen(false)}>Upload Results</Link>
                </li>
              </>
            ) : null}
          </ul>

          <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
            {isLoggedIn ? (
              <button className="btn btn-outline-danger btn-sm px-4 rounded-pill" onClick={handleLogout}>
                Logout
              </button>
            ) : (
              <>
                <Link to="/login" className="btn btn-primary btn-sm px-4 rounded-pill" onClick={() => setIsNavOpen(false)}>
                  Login
                </Link>
                <Link to="/register" className="btn btn-outline-primary btn-sm px-4 rounded-pill d-none d-sm-inline-block" onClick={() => setIsNavOpen(false)}>
                  Register
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
