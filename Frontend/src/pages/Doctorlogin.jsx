import React from "react";
import { Link } from "react-router-dom";
import "../styles/doctorlogin.css";
import DoctorImage from "../assets/doctorlogin.png"; // keep just this one real image

const Doctorlogin = () => {
  return (
    <main className="doctor-login-final">
      <section className="doctor-login-container">
        {/* LEFT — clean visuals without external clipart */}
        <aside className="doctor-left">
          <div className="visual-layer">
            <img src={DoctorImage} alt="Doctor" className="doctor-photo" />

            {/* vector-like shapes */}

            <div className="overlay-text">
              <h2>Empowering Every Diagnosis</h2>
              <p>Where care meets technology.</p>
            </div>
          </div>
        </aside>

        {/* RIGHT — login section */}
        <section className="doctor-right">
          <span className="eyebrow">Doctor’s Portal</span>

          <h1 className="title">
            Focus on <span>Care</span>, <br /> We’ll handle the <span>Data</span>.
          </h1>

          <p className="subtitle">
            Manage patient records, collaborate securely,  
            and access everything you need in seconds.
          </p>

          <div className="actions">
            <Link to="/userlogininner" className="btn primary">
              Login
            </Link>
            <Link to="/register" className="btn outline">
              Signup
            </Link>
          </div>

          <ul className="features">
            <li>🩺 Unified patient dashboard</li>
            <li>🔐 HIPAA-compliant access</li>
            <li>💡 Built for clinical precision</li>
          </ul>
        </section>
      </section>
    </main>
  );
};

export default Doctorlogin;
