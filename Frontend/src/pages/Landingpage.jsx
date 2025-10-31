import React from "react";
import { Link } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "../styles/LandingPage.css";
import Aboutus from "../assets/Aboutus_logo.png";
import Image1 from "../assets/landingpage.png";

const LandingPage = () => {
  const year = new Date().getFullYear();

  return (
    <main className="landing-page">
      {/* ===== HERO ===== */}
      <header id="home" className="container position-relative hv-hero py-5 py-lg-6">
        <div className="hv-gradient" aria-hidden="true" />
        <div className="row align-items-center g-5">
          <div className="col-lg-6">
            <span className="badge rounded-pill hv-badge">New • Smarter sharing</span>
            <h1 className="display-4 fw-black text-primary lh-1 hv-hero-title">
              Streamlining health records
              <span className="d-block">effortlessly</span>
            </h1>
            <p className="lead mt-3 text-secondary">
              Your complete health vault — secure uploads, instant sharing, and lightning search for
              patients, doctors, and diagnostics.
            </p>

            <div className="d-flex flex-wrap gap-3 mt-4">
              <Link className="btn hv-btn-primary btn-lg px-4" to="/UserLogin">
                Create free account
              </Link>
              <a className="btn hv-btn-ghost btn-lg px-4" href="#features">
                Learn more
              </a>
            </div>

            <ul className="list-unstyled d-flex flex-wrap gap-4 mt-4 small text-muted" aria-label="Trust markers">
              <li>256-bit encryption</li>
              <li>Role-based access</li>
              <li>Works on any device</li>
            </ul>
          </div>

          <div className="col-lg-6 position-relative">
            <div className="hv-blob" aria-hidden="true" />
            <div className="hv-hero-card glass shadow-lg p-3 p-md-4">
              <img
                src={Image1}
                alt="Illustration of easy health record management"
                className="img-fluid rounded-4 hv-hero-img"
              />
              <div className="d-flex justify-content-between align-items-center mt-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="dot dot-green" />
                  <span className="small text-muted">Synced</span>
                </div>
                <span className="small text-muted">Search &lt; 5s</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick stats */}
        <div className="row text-center mt-5 g-4" role="group" aria-label="Quick stats">
          <div className="col-6 col-md-3"><div className="hv-stat">99.9%<span>uptime</span></div></div>
          <div className="col-6 col-md-3"><div className="hv-stat">256-bit<span>encryption</span></div></div>
          <div className="col-6 col-md-3"><div className="hv-stat">RBAC<span>controls</span></div></div>
          <div className="col-6 col-md-3"><div className="hv-stat">Audit<span>history</span></div></div>
        </div>
      </header>

      {/* ===== FEATURES ===== */}
      <section id="features" className="container py-5">
        <div className="text-center mb-4">
          <h2 className="fw-bold text-primary">Built for everyone in care</h2>
          <p className="text-secondary">Delightful UX with serious security.</p>
        </div>

        <div className="row g-4">
          {[
            { title: "👥 Users", desc: "Keep all reports, bills, and prescriptions together. Share securely with one link.", chip: "Private & Secure" },
            { title: "🩺 Doctors", desc: "Instant history, cleaner consultations, and fewer repeats. Less paperwork.", chip: "Faster Care" },
            { title: "🧪 Diagnostics", desc: "Paperless reports, automatic delivery to patients & doctors, no manual follow-ups.", chip: "Paperless" },
            { title: "🔎 Smart Search", desc: "Find files by date range, type, or tags. Highlights match snippets.", chip: "Blazing Fast" },
            { title: "🔐 Access Control", desc: "Time-bound links, revoke access anytime, view audit logs.", chip: "You’re in Control" },
            { title: "📱 Mobile Ready", desc: "Camera uploads, PDF support, and responsive UI across devices.", chip: "On the go" },
          ].map((f, i) => (
            <div className="col-sm-6 col-lg-4" key={i}>
              <article className="hv-card h-100 p-4 reveal">
                <h4 className="mb-2">{f.title}</h4>
                <p className="text-muted mb-3">{f.desc}</p>
                <span className="hv-chip">{f.chip}</span>
              </article>
            </div>
          ))}
        </div>
      </section>

      {/* ===== HOW IT WORKS / ABOUT ===== */}
      <section id="how" className="container py-5">
        <div className="row g-4 align-items-center">
          <div className="col-lg-6 order-lg-2">
            <img src={Aboutus} alt="About HealthVault" className="img-fluid rounded-4 shadow-sm reveal" />
          </div>
          <div className="col-lg-6">
            <h2 className="fw-bold text-primary">How it works</h2>
            <ol className="hv-steps mt-3">
              <li><strong>Upload</strong> PDFs or photos from mobile/desktop — auto-organized by date & type.</li>
              <li><strong>Tag</strong> with smart labels (e.g., “MRI”, “Prescription”, “Invoice”) for easy filtering.</li>
              <li><strong>Share</strong> time-bound links with doctors/labs. Revoke access anytime.</li>
            </ol>
            <div className="d-flex gap-3 mt-4">
              <Link className="btn hv-btn-primary" to="/UserLogin">Try it now</Link>
              <a className="btn hv-btn-ghost" href="#faq">Read FAQ</a>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TESTIMONIALS ===== */}
      <section className="hv-section-alt py-5 border-top border-bottom">
        <div className="container">
          <h2 className="fw-bold text-primary text-center mb-4">Loved by families & clinics</h2>
          <div className="row g-4">
            {[
              { quote: "“My mother’s reports are finally in one place. Sharing with the cardiologist took seconds.”", name: "Ananya • Caregiver" },
              { quote: "“I waste less time asking repeated questions. I see the history instantly and move faster.”", name: "Dr. Vivek • Physician" },
              { quote: "“No printing, no calls. Reports go straight to patients and doctors. Clean.”", name: "Meera • Lab Admin" },
            ].map((t, idx) => (
              <div key={idx} className="col-md-4">
                <figure className="hv-quote h-100 reveal">
                  <blockquote>{t.quote}</blockquote>
                  <figcaption>{t.name}</figcaption>
                </figure>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section id="cta" className="container py-5">
        <div className="hv-cta d-md-flex align-items-center justify-content-between p-4 p-lg-5 rounded-4 reveal">
          <div>
            <h3 className="fw-bold text-primary mb-2">Start your secure health vault today</h3>
            <p className="mb-0 text-secondary">Free for individuals. Simple plans for clinics and labs.</p>
          </div>
          <div className="text-md-end">
            <Link className="btn hv-btn-primary btn-lg mt-3 mt-md-0" to="/UserLogin">Get Started</Link>
            <div className="d-flex flex-wrap gap-2 mt-3 justify-content-md-end">
              <Link className="btn btn-outline-primary" to="/DoctorLogin">I’m a Doctor</Link>
              <Link className="btn btn-outline-primary" to="/DiagnosticLogin">I’m a Diagnostic Center</Link>
            </div>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section id="faq" className="container py-5">
        <h2 className="fw-bold text-primary text-center mb-4">Frequently asked questions</h2>
        <div className="accordion reveal" id="faqAcc">
          {[
            { q: "Is my data private?", a: "Yes. Your files are encrypted in transit and at rest. You control sharing links and can revoke access anytime." },
            { q: "Can I upload from my phone?", a: "Absolutely. HealthVault is mobile-friendly and supports camera uploads and PDFs." },
            { q: "How do doctors access my records?", a: "Share a secure link or add their email. You can set expiry and permissions." },
          ].map((item, idx) => (
            <div className="accordion-item" key={idx}>
              <h2 className="accordion-header" id={`faq-h-${idx}`}>
                <button
                  className="accordion-button collapsed"
                  type="button"
                  data-bs-toggle="collapse"
                  data-bs-target={`#faq-c-${idx}`}
                  aria-expanded="false"
                  aria-controls={`faq-c-${idx}`}
                >
                  {item.q}
                </button>
              </h2>
              <div id={`faq-c-${idx}`} className="accordion-collapse collapse" data-bs-parent="#faqAcc">
                <div className="accordion-body">{item.a}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ===== FOOTER ===== */}
      <footer className="bg-dark text-light py-4 mt-5">
        <div className="container d-flex flex-column flex-md-row justify-content-between align-items-center gap-3">
          <p className="mb-0 small">© {year} HealthVault. All rights reserved.</p>
          <ul className="nav small">
            <li className="nav-item"><a className="nav-link px-2 text-light-50" href="/#privacy">Privacy</a></li>
            <li className="nav-item"><a className="nav-link px-2 text-light-50" href="/#terms">Terms</a></li>
            <li className="nav-item"><a className="nav-link px-2 text-light-50" href="/#support">Support</a></li>
          </ul>
        </div>
      </footer>
    </main>
  );
};

export default LandingPage;
