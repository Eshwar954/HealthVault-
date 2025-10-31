import React, { useState } from 'react';
import axios from 'axios';
import '../styles/userlogininner.css';

const UserLoginInner = () => {
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
        'http://localhost:5000/api/auth/login',
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
          window.location.href = '/doctor/dashboard';
          break;
        case 'diagnostic center':
          window.location.href = '/diagnostic/dashboard';
          break;
        default:
          window.location.href = '/user/dashboard';
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <main className="uv-login">
      <section className="uv-glass">
        <div className="uv-left">
          <h1 className="uv-brand">HealthVault</h1>
          <p className="uv-tagline">Your health. Your data. Your control.</p>
          <div className="uv-graphic">
            <div className="uv-pulse" />
            <div className="uv-dots" />
          </div>
        </div>

        <div className="uv-right">
          <h2 className="uv-title">Welcome</h2>
          <p className="uv-subtitle">Sign in to access your dashboard</p>

          <form className="uv-form" onSubmit={handleLogin}>
            <input
              type="email"
              name="email"
              placeholder="Email address"
              value={email}
              onChange={handleChange}
              required
            />

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={password}
              onChange={handleChange}
              required
            />

            <select name="role" value={role} onChange={handleChange}>
              <option value="user">User</option>
              <option value="doctor">Doctor</option>
              <option value="diagnostic center">Diagnostic Center</option>
            </select>

            <button type="submit" className="uv-btn">
              Login
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default UserLoginInner;
