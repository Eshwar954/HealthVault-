import React from "react";
import { Link } from "react-router-dom";
import "../styles/userlogin.css";

const UserLogin = () => {
  return (
    <main className="user-login">
      <section className="ul-wrap">
        {/* LEFT: Visual Showcase */}
        <aside className="ul-left" aria-hidden="true">
          {/* Gradient Blobs */}
          <div className="ul-blob b1"></div>
          <div className="ul-blob b2"></div>

          {/* Animated Mock UI Showcase */}
          <div className="ul-showcase">
            <div className="ul-showcase">
              <div className="mock-dashboard">
                <h3 className="mock-brand">HealthVault</h3>
                <p className="mock-tagline">Your records, your control</p>

                <div className="mock-header" />
                <div className="mock-chart" />
                <div className="mock-table">
                  {[...Array(4)].map((_, i) => (
                    <div key={i} className="mock-row" />
                  ))}
                </div>
              </div>

              <div className="mock-phone">
                <div className="mock-screen">
                  <span className="mock-app">HV</span>
                </div>
              </div>
            </div>
          </div>
        </aside>

        {/* RIGHT: Login CTA */}
        <section className="ul-right" role="region" aria-label="User login">
          <span className="ul-eyebrow">user’s portal</span>

          <h1 className="ul-title">
            Store, <span>Access</span> & <span>Share</span>
          </h1>

          <p className="ul-subtitle">
            Keep all your health records in one secure place — accessible on any
            device, anytime. Share your history with doctors, clinics, or
            diagnostic centers. Manage smarter, live healthier.
          </p>

          <div className="ul-actions">
            <Link to="/UserLogininner" className="ul-btn ul-btn-primary">
              Login
            </Link>
            <Link to="/register" className="ul-btn ul-btn-ghost">
              Signup
            </Link>
          </div>

          <ul className="ul-trust">
            <li>🔒 Zero-knowledge storage</li>
            <li>⚡ Instant access</li>
            <li>📱 Works everywhere</li>
          </ul>
        </section>
      </section>
    </main>
  );
};

export default UserLogin;
