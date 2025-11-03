import { useState } from "react";
import axios from "axios";
import toast, { Toaster } from "react-hot-toast";
import "../styles/register.css";
const BASE_URL = import.meta.env.VITE_API_URL;
const Register = () => {
  const [step, setStep] = useState(1);
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

  const nextStep = () => {
    if (!formData.name || !formData.email || !formData.password)
      return toast.error("Please fill all required fields.");
    if (formData.password.length < 6)
      return toast.error("Password must be at least 6 characters.");
    setStep(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        ...formData,
        ...(formData.role === "diagnostic center" && {
          services: formData.services
            ? formData.services.split(",").map((s) => s.trim())
            : [],
        }),
      };
      await axios.post(`${BASE_URL}/api/auth/register`, payload);
      toast.success("Registration successful!");
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
      setStep(1);
    } catch (error) {
      console.error("Registration Error:", error);
      toast.error(error.response?.data?.message || "Registration failed");
    }
  };

  const accentColor =
    formData.role === "doctor"
      ? "#14b8a6"
      : formData.role === "diagnostic center"
      ? "#9333ea"
      : "#6366f1";

  return (
    <main className="reg-pro" style={{ "--accent": accentColor }}>
      <Toaster position="top-center" reverseOrder={false} />
      <section className="reg-pro-card">
        <div className="reg-pro-left">
          <h1>HealthVault</h1>
          <p>Your trusted digital health record vault</p>
          <div className="reg-glow" />
        </div>

        <div className="reg-pro-right">
          <div className="step-indicator">
            <span className={step === 1 ? "active" : ""}>1</span>
            <div className="line" />
            <span className={step === 2 ? "active" : ""}>2</span>
          </div>

          <h2>
            {step === 1 ? "Create your account" : "Complete your details"}
          </h2>

          <form className="reg-pro-form" onSubmit={handleSubmit}>
            {step === 1 && (
              <div className="step fadeSlide">
                <input
                  type="text"
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
                  placeholder="Password (min 6 chars)"
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
                <button
                  type="button"
                  className="next-btn"
                  onClick={nextStep}
                >
                  Next →
                </button>
              </div>
            )}

            {step === 2 && (
              <div className="step fadeSlide">
                {formData.role === "user" && (
                  <>
                    <input
                      type="date"
                      name="dateOfBirth"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
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
                  </>
                )}

                {formData.role === "doctor" && (
                  <>
                    <input
                      type="text"
                      name="specialization"
                      value={formData.specialization}
                      onChange={handleChange}
                      placeholder="Specialization"
                    />
                    <input
                      type="text"
                      name="clinicAddress"
                      value={formData.clinicAddress}
                      onChange={handleChange}
                      placeholder="Clinic Address"
                    />
                    <input
                      type="number"
                      name="experience"
                      value={formData.experience}
                      onChange={handleChange}
                      placeholder="Experience (in years)"
                    />
                  </>
                )}

                {formData.role === "diagnostic center" && (
                  <>
                    <input
                      type="text"
                      name="services"
                      value={formData.services}
                      onChange={handleChange}
                      placeholder="Services (comma-separated)"
                    />
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      placeholder="Center Address"
                    />
                  </>
                )}

                <div className="form-actions">
                  <button
                    type="button"
                    className="back-btn"
                    onClick={() => setStep(1)}
                  >
                    ← Back
                  </button>
                  <button type="submit" className="reg-pro-btn">
                    Register
                  </button>
                </div>
              </div>
            )}
          </form>
        </div>
      </section>
    </main>
  );
};

export default Register;
