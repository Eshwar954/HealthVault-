import React from "react";
import "bootstrap/dist/css/bootstrap.min.css"; // Import Bootstrap CSS
import "../styles/LandingPage.css"; // Import custom CSS for additional styling
import Aboutus from "../assets/Aboutus_logo.png"; // Import image for About Us section
import Image1 from "../assets/landingpage.png"; // Import image for the landing page


const LandingPage = () => {
  return (
    <div className="landing-page">
      <div className="container py-5">
        <div className="row align-items-center text-center text-md-start">
          <div className="col-12 col-md-6 mb-4 mb-md-0">
            <h1>Streamlining</h1>
            <h1>health records</h1>
            <h1>effortlessly</h1>
            <h5>
              Health Vault is here for you with easy health record storage and
              sharing.
            </h5>
            <h5>Connecting patients, doctors, and diagnostics effortlessly</h5>
            <div className="buttons mt-4">
              <button className="btn me-3">Get Started</button>
              <button className="btn ">Learn More</button>
            </div>
          </div>

          <div className="col-12 col-md-6 d-flex justify-content-center">
            <div className="image-container">
            <img src={Image1} alt="Image" />
            </div>
          </div>
        </div>
      </div>

      <div className="middle py-5 d-flex flex-wrap justify-content-center">
        <div className="users-box col-12 col-sm-6 col-md-4">
          <h4 className="text-user">👥Users</h4>
          <ul>
            <li>
              <p>Store all your medical records in one place.</p>
            </li>
            <li>
              <p>
                Share your medical records with your doctor or diagnostics
                securely.
              </p>
            </li>
            <li>
              <p>Access your medical records anytime, anywhere.</p>
            </li>
          </ul>
        </div>
        <div className="doctors-box col-12 col-sm-6 col-md-4">
          <h4 className="text-doctor">🏥Doctors</h4>
          <ul>
            <li>
              <p>Access patient records instantly, anywhere</p>
            </li>
            <li>
              <p>Streamline consultations with organized medical histories</p>
            </li>
            <li>
              <p>Share prescriptions securely and efficiently.</p>
            </li>
          </ul>
        </div>
        <div className="diagnostics-box col-12 col-sm-6 col-md-4">
          <h4 className="text-diagnostic">🏥Diagnostics</h4>
          <ul>
            <li>
              <p>Digitally share test results with patients and doctors.</p>
            </li>
            <li>
              <p>Improve efficiency with paperless workflows.</p>
            </li>
            <li>
              <p>Enhance patient trust with secure and fast access.</p>
            </li>
          </ul>
        </div>
      </div>

      <div className="bottom">
        {/* About Section */}
        <div className="about d-flex justify content-space-between align-items-center">
          {/* Left Side - Image */}
          <div className="about_left">
            <img src={Aboutus} alt="About Us" />
          </div>

          {/* Right Side - Text Content */}
          <div className="about_right">
            <h2 className="about-heading">About Us</h2>
            <p>
              At Health Vault, we make managing your health records easy and
              secure.
            </p>
            <p>
              Our platform lets you store, share, and access medical documents
              seamlessly.
            </p>
            <p>
              Whether it’s connecting with your doctor, receiving diagnostic
              reports, or keeping your records organized, we ensure everything
              is just a click away.
            </p>
            <p>
              <strong>
                Health Vault - your partner in Smarter Health Management.
              </strong>
            </p>
          </div>
        </div>

        {/* Footer Section */}
        <div className="footer bg-dark text-light text-center py-3">
          {
            <p className="mb-0">
              © {new Date().getFullYear()} HealthVault. All rights reserved.
            </p>
          }
        </div>
      </div>
    </div>
  );
};

export default LandingPage;
