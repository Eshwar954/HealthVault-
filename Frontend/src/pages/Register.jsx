import { useState } from "react";
import axios from "axios";
import "../styles/register.css";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "user",
    age: "",
    gender: "",
    phone: "",
    dateOfBirth: "",
    specialization: "",
    experience: "",
    clinicAddress: "",
    services: "",
    address: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.name || !formData.email || !formData.password) {
      alert("Please fill in all required fields.");
      return;
    }

    if (formData.password.length < 6) {
      alert("Password must be at least 6 characters.");
      return;
    }

    try {
      const payload = {
        ...formData,
        ...(formData.role === "diagnostic center" && {
          services: formData.services
            ? formData.services.split(",").map((service) => service.trim())
            : [],
        }),
      };

      await axios.post("http://localhost:5000/api/auth/register", payload);
      alert("Registration successful!");

      setFormData({
        name: "",
        email: "",
        password: "",
        role: "user",
        age: "",
        gender: "",
        phone: "",
        dateOfBirth: "",
        specialization: "",
        experience: "",
        clinicAddress: "",
        services: "",
        address: "",
      });
    } catch (error) {
      console.error("Registration Error:", error);
      alert(error.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="register-container">
      <h2 className="register-heading">Register</h2>
      <form className="register-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            type=""
            name="name"
            value={formData.name}
            onChange={handleChange}
            placeholder="Full Name"
            required
          />
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Email Address"
            required
          />
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Password (min 6 characters)"
            required
          />
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
          >
            <option value="user">User</option>
            <option value="doctor">Doctor</option>
            <option value="diagnostic center">Diagnostic Center</option>
          </select>
        </div>

        {formData.role === "user" && (
          <div className="form-group user-fields">
            <input
              type="date"
              name="dateOfBirth"
              value={formData.dateOfBirth}
              onChange={handleChange}
              placeholder="Date of Birth"
            />
            <input
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              placeholder="Age"
            />
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
            >
              <option value="">Select Gender</option>
              <option value="Male">Male</option>
              <option value="Female">Female</option>
              <option value="Other">Other</option>
            </select>

            <input
              type="text"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Phone Number"
            />
          </div>
        )}

        {formData.role === "doctor" && (
          <div className="form-group doctor-fields">
            <input
              type="text"
              name="specialization"
              value={formData.specialization}
              onChange={handleChange}
              placeholder="Specialization"
              required
            />
            <input
              type="text"
              name="clinicAddress"
              value={formData.clinicAddress}
              onChange={handleChange}
              placeholder="Clinic Address"
              required
            />
            <input
              type="number"
              name="experience"
              value={formData.experience}
              onChange={handleChange}
              placeholder="Experience (in years)"
              required
            />
          </div>
        )}

        {formData.role === "diagnostic center" && (
          <div className="form-group diagnostic-fields">
            <input
              type="text"
              name="services"
              value={formData.services}
              onChange={handleChange}
              placeholder="Services (comma-separated)"
              required
            />
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Center Address"
              required
            />
          </div>
        )}

        <div className="form-group">
          <button type="submit" className="register-btn">
            Register
          </button>
        </div>
      </form>
    </div>
  );
};

export default Register;
