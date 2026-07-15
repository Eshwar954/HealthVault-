import { ArrowRight, CalendarDays, FileText, FlaskConical, HeartPulse, LockKeyhole, ShieldCheck, Stethoscope } from "lucide-react";
import { Link } from "react-router-dom";
import "../styles/LandingPage.css";
import Image1 from "../assets/landingpage.png";

const LandingPage = () => (
  <main className="hv-home">
    <section className="hv-hero">
      <div className="hv-wrap hv-hero-grid">
        <div className="hv-hero-copy">
          <p className="hv-eyebrow"><ShieldCheck size={15} /> Patient-controlled record access</p>
          <h1>Health records that move with your care.</h1>
          <p className="hv-lead">HealthVault brings appointments, medical reports, and diagnostic results into one calm, secure place for patients, doctors, and centres.</p>
          <div className="hv-actions"><Link className="hv-button hv-button-primary" to="/register">Create your vault <ArrowRight size={17} /></Link><Link className="hv-button hv-button-secondary" to="/login">Sign in</Link></div>
          <div className="hv-trust"><span><LockKeyhole size={16} />Appointment-bound access</span><span><FileText size={16} />One record timeline</span></div>
        </div>
        <div className="hv-hero-visual"><div className="hv-window-bar"><i /><i /><i /><span>healthvault.com</span></div><img src={Image1} alt="HealthVault medical record workspace" /></div>
      </div>
    </section>

    <section className="hv-proof"><div className="hv-wrap hv-proof-grid"><div><strong>24 hours</strong><span>doctor record-access window</span></div><div><strong>One vault</strong><span>for every medical document</span></div><div><strong>Full activity</strong><span>of record access and updates</span></div></div></section>

    <section id="care-model" className="hv-section"><div className="hv-wrap"><div className="hv-section-heading"><p className="hv-eyebrow">Designed around care</p><h2>A clearer flow for every visit.</h2><p>There are no passcodes to share. Access starts only when care is actually arranged.</p></div><div className="hv-flow"><article><span className="hv-flow-icon"><CalendarDays /></span><b>1. Book care</b><p>A patient chooses a doctor and consultation time.</p></article><article><span className="hv-flow-icon"><Stethoscope /></span><b>2. Confirm visit</b><p>When accepted, access is created for that appointment.</p></article><article><span className="hv-flow-icon"><FileText /></span><b>3. View records</b><p>Doctors can open records only within that limited window.</p></article><article><span className="hv-flow-icon"><FlaskConical /></span><b>4. Deliver reports</b><p>Diagnostic centres upload results against assigned orders.</p></article></div></div></section>

    <section className="hv-section hv-section-tint"><div className="hv-wrap hv-split"><div><p className="hv-eyebrow">Your control, clearly visible</p><h2>Every record interaction has a reason.</h2><p>Patients can see appointment status, active access windows, uploaded reports, and recent record activity from a single workspace.</p><Link className="hv-text-link" to="/user/appointments">Explore care access <ArrowRight size={16} /></Link></div><div className="hv-dashboard-preview"><div className="hv-preview-header"><span><HeartPulse size={18} /> HealthVault</span><span>Patient workspace</span></div><div className="hv-preview-body"><div className="hv-preview-profile"><span className="hv-avatar">SJ</span><div><b>Sarah Jenkins</b><small>Patient record overview</small></div><span className="hv-status">Access active</span></div><div className="hv-preview-columns"><div><b>Upcoming appointment</b><p>Consultation with Dr. Reed</p><small>Oct 26, 10:00 AM</small></div><div><b>Recent activity</b><p>Lab report uploaded</p><small>Today, 09:42 AM</small></div></div></div></div></div></section>

    <section className="hv-cta"><div className="hv-wrap"><div><p className="hv-eyebrow">Ready when you are</p><h2>Make health records easier to manage.</h2><p>Create a private vault and arrange care with clear, time-bound access.</p></div><Link className="hv-button hv-button-light" to="/register">Get started <ArrowRight size={17} /></Link></div></section>
  </main>
);

export default LandingPage;
