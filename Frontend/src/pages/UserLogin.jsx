import React from 'react';
import '../styles/userlogin.css';
import LoginImage from '../assets/login_image_letf.png';
import { Link } from 'react-router-dom';

const UserLogin = () => {
  return (
    <div className="user-login">
      <div className="portal">
        {/* Left Section with Image */}
        <div className="portal-image-wrapper">
          <img src={LoginImage} alt="Portal Preview" className="portal-image" />
        </div>

        {/* Right Section with Text and Buttons */}
        <div className="portal-content">
          <h4 className="portal-title">User’s Portal</h4>
          <h1 className="portal-heading">
            Store, <span>Access</span> & <span>Share</span>
          </h1>
          <p className="portal-description">
            Store all your health records in one place, accessible from any device, anytime.
            Share your history seamlessly with any healthcare provider for efficient care.
            Effortlessly track, manage, and share your medical data, ensuring timely and informed
            healthcare decisions.
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

export default UserLogin;
