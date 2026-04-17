import React, { useEffect, useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/Navbar.css";

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

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
    localStorage.removeItem("email");
    localStorage.removeItem("userId");
    sessionStorage.removeItem("redirected");
    setIsNavOpen(false);
    setIsDropdownOpen(false);
    navigate("/");
  };

  const isActive = (path) => (location.pathname === path ? "active" : "");

  return (
    <nav className="navbar navbar-expand-lg bg-light app-navbar">
      <div className="container px-5">
        {/* Brand */}
        <Link to="/" className="navbar-brand" onClick={() => setIsNavOpen(false)}>HealthVault</Link>

        {/* Toggler */}
        <button
          className="navbar-toggler"
          type="button"
          onClick={() => setIsNavOpen(!isNavOpen)}
          aria-expanded={isNavOpen}
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon" />
        </button>

        {/* Center links */}
        <div className={`collapse navbar-collapse justify-content-center ${isNavOpen ? 'show' : ''}`} id="hvNav">
          <ul className="navbar-nav">
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
                <li className="nav-item">
                  <Link to="/register" className={`nav-link ${isActive("/register")}`} onClick={() => setIsNavOpen(false)}>Register</Link>
                </li>
              </>
            ) : role === "user" ? (
              <>
                <li className="nav-item">
                  <Link to="/user/dashboard" className={`nav-link ${isActive("/user/dashboard")}`} onClick={() => setIsNavOpen(false)}>Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/uploads" className={`nav-link ${isActive("/user/uploads")}`} onClick={() => setIsNavOpen(false)}>Uploads</Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/files" className={`nav-link ${isActive("/user/files")}`} onClick={() => setIsNavOpen(false)}>Files</Link>
                </li>
              </>
            ) : role === "doctor" ? (
              <>
                <li className="nav-item">
                  <Link to="/doctor/dashboard" className={`nav-link ${isActive("/doctor/dashboard")}`} onClick={() => setIsNavOpen(false)}>Doctor Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/requestaccess" className={`nav-link ${isActive("/requestaccess")}`} onClick={() => setIsNavOpen(false)}>Request Access</Link>
                </li>
              </>
            ) : role === "diagnostic center" || role === "diagnostic" ? (
              <>
                <li className="nav-item">
                  <Link to="/diagnostic/dashboard" className={`nav-link ${isActive("/diagnostic/dashboard")}`} onClick={() => setIsNavOpen(false)}>Diagnostic Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link to="/diagnostic/upload" className={`nav-link ${isActive("/diagnostic/upload")}`} onClick={() => setIsNavOpen(false)}>Upload Reports</Link>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        {/* Right: auth */}
        <div className="nav-item position-relative d-none d-lg-block">
          {isLoggedIn ? (
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <div className="dropdown">
              <button
                className="btn login-btn dropdown-toggle"
                onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                aria-expanded={isDropdownOpen}
              >
                Login
              </button>
              <ul className={`dropdown-menu dropdown-menu-end ${isDropdownOpen ? 'show' : ''}`} style={{position: 'absolute'}}>
                <li><Link to="/UserLogin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>User Login</Link></li>
                <li><Link to="/Doctorlogin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Doctor Login</Link></li>
                <li><Link to="/Diagnosticlogin" className="dropdown-item" onClick={() => setIsDropdownOpen(false)}>Diagnostic Center Login</Link></li>
              </ul>
            </div>
          )}
        </div>

        {/* Mobile auth */}
        <div className="d-lg-none w-100 mt-3 text-center">
           {isNavOpen && !isLoggedIn && (
             <div className="d-flex flex-column gap-2">
                <Link to="/UserLogin" className="btn btn-outline-primary w-100" onClick={() => setIsNavOpen(false)}>User Login</Link>
                <Link to="/Doctorlogin" className="btn btn-outline-primary w-100" onClick={() => setIsNavOpen(false)}>Doctor Login</Link>
                <Link to="/Diagnosticlogin" className="btn btn-outline-primary w-100" onClick={() => setIsNavOpen(false)}>Diagnostic Center Login</Link>
             </div>
           )}
           {isNavOpen && isLoggedIn && (
             <button className="btn btn-danger w-100 mt-2" onClick={handleLogout}>
              Logout
            </button>
           )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
