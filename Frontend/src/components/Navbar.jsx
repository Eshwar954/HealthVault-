import React, { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import '../styles/Navbar.css';

const Navbar = () => {
  const navigate = useNavigate();

  // Get user role from localStorage
  const role = localStorage.getItem('role');
  const isLoggedIn = !!role;

  // Redirect based on role after login
  useEffect(() => {
    if (!sessionStorage.getItem('redirected')) {
      if (role === 'user') {
        navigate('/user/dashboard');
      } else if (role === 'doctor') {
        navigate('/doctor/dashboard');
      } else if (role === 'diagnostic center') {
        navigate('/diagnostic/dashboard');
      }
      sessionStorage.setItem('redirected', 'true');
    }
  }, [role, navigate]);
  

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('userId');
    navigate('/');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light mt-3">
      <div className="container px-5">
        {/* Logo */}
        <Link to="/" className="navbar-brand">HealthVault</Link>

        {/* Toggler for Mobile */}
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav" 
          aria-controls="navbarNav" 
          aria-expanded="false" 
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Centered Links */}
        <div className="collapse navbar-collapse justify-content-center" id="navbarNav">
          <ul className="navbar-nav">
            {!isLoggedIn ? (
              <>
                <li className="nav-item">
                  <Link to="/" className="nav-link">Home</Link>
                </li>
              </>
            ) : role === 'user' ? (
              <>
                <li className="nav-item">
                  <Link to="/user/dashboard" className="nav-link">Profile</Link>
                </li>
                <li className="nav-item">
                  <Link to="/user/uploads" className="nav-link">Uploads</Link>
                </li>
                <li className="nav-item px-4">
                  <Link to="/user/files" className="nav-link">Files</Link>
                </li>
              </>
            ) : role === 'doctor' ? (
              <>
                <li className="nav-item">
                  <Link to="/doctor/dashboard" className="nav-link">Doctor Dashboard</Link>
                </li>
                <li className="nav-item px-4">
                  <Link to="/requestaccess" className="nav-link">Request Access</Link>
                </li>
              </>
            ) : role === 'diagnostic center' ? (
              <>
                <li className="nav-item">
                  <Link to="/diagnostic/dashboard" className="nav-link">Diagnostic Dashboard</Link>
                </li>
                <li className="nav-item px-4">
                  <Link to="/diagnostic/upload" className="nav-link">Request Access</Link>
                </li>
              </>
            ) : null}
          </ul>
        </div>

        {/* Right Side Login/Logout */}
        <div className="nav-item dropdown">
          {isLoggedIn ? (
            <button className="btn btn-outline-danger" onClick={handleLogout}>
              Logout
            </button>
          ) : (
            <div className="dropdown">
              <button 
                className="btn btn-outline-primary dropdown-toggle" 
                id="dropdownMenuButton" 
                data-bs-toggle="dropdown" 
                aria-expanded="false"
              >
                Login
              </button>
              <ul className="dropdown-menu" aria-labelledby="dropdownMenuButton">
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
