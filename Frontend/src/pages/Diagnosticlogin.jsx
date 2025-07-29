import React from 'react';
import '../styles/userlogin.css';
import diaimg from '../assets/diagnosticlogin.png';
import { Link } from 'react-router-dom';

const Diagnosticlogin = () => {
  return (
    <div className="user-login">
      <div className="portal">
        {/* Left Section with Image */}
        <div className="portal-image-wrapper">
          <img src={diaimg} alt="Portal Preview" className="portal-image" />
        </div>

        {/* Right Section with Text and Buttons */}
        <div className="portal-content">
          <h4 className="portal-title">Diagnostic’s Portal</h4>
          <h1 className="portal-heading">
            Efficiently Store &<span> Share Diagnostic</span> & <span>Results.</span>
          </h1>
          <p className="portal-description">
          Store and share diagnostic reports digitally, ensuring immediate
 access and improving healthcare efficiency. Make every report
 instantly available for doctors and patients.
          </p>
          <div className="portal-buttons">
            <Link to="/UserLogininner"><button className="btn login-btn">Login</button></Link>
            <Link to="/register"><button className="btn signup-btn">Signup</button></Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Diagnosticlogin;
