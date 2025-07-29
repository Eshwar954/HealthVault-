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
  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle login submission
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
        {
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      const { token, role: userRole, userId,loginId} = response.data;

      // Store token and user details in localStorage
      localStorage.setItem('token', token);
      localStorage.setItem('role', userRole);
      localStorage.setItem('userId', userId);
      localStorage.setItem('email', email);
      localStorage.setItem('loginId', loginId);

      console.log(`Email stored in localStorage: ${localStorage.getItem('email')}`);
      console.log(`Login ID stored in localStorage: ${localStorage.getItem('loginId')}`);


      alert('Login successful!');

      // Redirect based on role
      switch (userRole) {
        case 'doctor':
          window.location.href = '/doctor/dashboard';
          break;
        case 'diagnostic center':
          window.location.href = '/diagnostic/dashboard';
          break;
        default:
          window.location.href = '/user/dashboard';
          break;
      }
    } catch (error) {
      console.error('Login Error:', error);
      alert(error.response?.data?.message || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>WELCOME!</h2>

        {/* Email */}
        <input className='hii'
          type="email"
          name="email"
          placeholder="Email"
          value={email}
          onChange={handleChange}
          required
        />

        {/* Password */}
        <input className='hii'
          type="password"
          name="password"
          placeholder="Password"
          value={password}
          onChange={handleChange}
          required
        />

        {/* Role Dropdown */}
        <select className='hello' name="role" value={role} onChange={handleChange}>
          <option value="user">User</option>
          <option value="doctor">Doctor</option>
          <option value="diagnostic center">Diagnostic Center</option>
        </select>

        {/* Login Button */}
        <button className="hi"type="submit">Login</button>
      </form>
    </div>
  );
};

export default UserLoginInner;
