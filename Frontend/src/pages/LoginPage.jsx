import React, { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import '../styles/login.css';

const BASE_URL = import.meta.env.VITE_API_URL;

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: 'user',
  });

  const { email, password, role } = formData;

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert('Please fill in all fields');
      return;
    }

    try {
      const validRoles = ['user', 'doctor', 'diagnostic center'];
      if (!validRoles.includes(role)) {
        alert('Invalid role selected');
        return;
      }

      const response = await axios.post(
        `${BASE_URL}/api/auth/login`,
        { email, password, role },
        { headers: { 'Content-Type': 'application/json' } }
      );

      const { token, role: userRole, userId, loginId } = response.data;
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);
      localStorage.setItem('loginId', loginId);

      alert('Login successful!');
      switch (userRole) {
        case 'doctor':
          navigate('/doctor/dashboard');
          break;
        case 'diagnostic center':
          navigate('/diagnostic/dashboard');
          break;
        default:
          navigate('/user/dashboard');
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <main className="uv-login">
      <section className="uv-card">
        <div className="uv-left">
          <h1 className="uv-brand">HealthVault</h1>
          <p className="uv-tagline">Access your secure health record portal</p>
          <div className="uv-info">
            <div className="info-item">
              <span className="icon">🔒</span>
              <p>End-to-End Encrypted</p>
            </div>
            <div className="info-item">
              <span className="icon">📱</span>
              <p>Mobile Optimized</p>
            </div>
          </div>
        </div>

        <div className="uv-right">
          <h2 className="uv-title">Sign In</h2>
          <p className="uv-subtitle">Select your role and enter credentials</p>

          <form className="uv-form" onSubmit={handleLogin}>
            <div className="form-group">
              <label>Select Role</label>
              <select name="role" value={role} onChange={handleChange}>
                <option value="user">User</option>
                <option value="doctor">Doctor</option>
                <option value="diagnostic center">Diagnostic Center</option>
              </select>
            </div>

            <div className="form-group">
              <label>Email Address</label>
              <input
                type="email"
                name="email"
                placeholder="email@example.com"
                value={email}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="********"
                value={password}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="uv-btn">
              Login to Portal
            </button>
          </form>

          <p className="uv-footer">
            Don't have an account? <Link to="/register">Create Account</Link>
          </p>
        </div>
      </section>
    </main>
  );
};

export default LoginPage;
