import { useState } from "react";
import { ArrowRight, HeartPulse, LockKeyhole, Mail, ShieldCheck } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import api from "../api/client";
import { useAuth } from "../context/AuthContext";
import "../styles/login.css";

const LoginPage = () => {
  const navigate = useNavigate();
  const { refreshUser } = useAuth();
  const [formData, setFormData] = useState({ email: "", password: "", role: "user" });
  const [submitting, setSubmitting] = useState(false);

  const handleLogin = async (event) => {
    event.preventDefault();
    setSubmitting(true);
    try {
      const response = await api.post("/api/auth/login", formData);
      await refreshUser();
      const destination = response.data.user.role === "doctor" ? "/doctor/appointments" : response.data.user.role === "diagnostic center" ? "/diagnostic/orders" : "/user/dashboard";
      navigate(destination);
    } catch (error) { toast.error(error.response?.data?.message || "Unable to sign in. Please try again."); }
    finally { setSubmitting(false); }
  };

  return <main className="auth-page"><section className="auth-frame"><div className="auth-story"><Link to="/" className="auth-logo"><span><HeartPulse size={20} /></span>HealthVault</Link><div className="auth-message"><p className="auth-kicker">Private patient record access</p><h1>Secure access to unified health records.</h1><p>Appointments, reports, and diagnostic results in one carefully controlled workspace.</p><div className="auth-trust"><ShieldCheck size={18} />Access is verified for every visit.</div></div></div><section className="auth-form-panel"><div className="auth-form-heading"><p>Welcome back</p><h2>Sign in to HealthVault</h2></div><form onSubmit={handleLogin} className="auth-form"><label>Account type<select value={formData.role} onChange={(event) => setFormData({ ...formData, role: event.target.value })}><option value="user">Patient</option><option value="doctor">Doctor</option><option value="diagnostic center">Diagnostic centre</option></select></label><label>Email address<span className="auth-input"><Mail size={17} /><input type="email" value={formData.email} onChange={(event) => setFormData({ ...formData, email: event.target.value })} placeholder="you@example.com" required /></span></label><label>Password<span className="auth-input"><LockKeyhole size={17} /><input type="password" value={formData.password} onChange={(event) => setFormData({ ...formData, password: event.target.value })} placeholder="Enter your password" required /></span></label><button className="auth-submit" disabled={submitting}>{submitting ? "Signing in..." : <>Sign in <ArrowRight size={17} /></>}</button></form><p className="auth-register">New to HealthVault? <Link to="/register">Create an account</Link></p></section></section></main>;
};

export default LoginPage;
