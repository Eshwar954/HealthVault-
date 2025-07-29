import React from 'react';
import '../styles/doctorlogin.css';
import DoctorImage from '../assets/doctorlogin.png'; // Assuming you'll have an image
import { Link } from 'react-router-dom';

function Doctorlogin() {
    return (
        <div className="app">
          <main className="main-content">
            <div className="left-section">
            <h4 className="portal-text">Doctor's Portal</h4>
              <h2>Digital Health</h2>
              <h2>Records for a</h2>
              <h2>Smarter Practice.</h2>
              <p>Simplify patient record-keeping and enhance your practice with digital solutions. Secure, quick access to patient histories means you can focus on what truly matters - patient care.</p>
              <div className="button-group">
                <Link to="/userlogininner"><button className="login-button">Login</button></Link>
                <Link to="/register"><button className="signup-button">Signup</button></Link>
              </div>
            </div>
            <div className="right-section">
              <img src={DoctorImage} alt="Doctor and Patient" className="doctor-image" />
            </div>
          </main>
        </div>
      );
}

export default Doctorlogin;