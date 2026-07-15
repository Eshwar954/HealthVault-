import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
import "../styles/doctordashboard.css";

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const fetchDoctorData = async () => {
    const res = await api.get("/api/doctors/me");
    const doctor = res.data.doctor || res.data;
    setDoctorData(doctor);
    setFormData(doctor);
  };

  useEffect(() => {
    fetchDoctorData().catch((err) => console.error("Error fetching doctor data:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/doctors/me", formData);
      setDoctorData(res.data.doctor);
      setFormData(res.data.doctor);
      setIsEditing(false);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to update profile");
    }
  };

  if (!doctorData) return <div className="docdash-loader">Loading your dashboard...</div>;

  const fields = [
    { key: "name", label: "Full Name" },
    { key: "email", label: "Email" },
    { key: "specialization", label: "Specialization" },
    { key: "experience", label: "Experience (Years)" },
    { key: "phone", label: "Contact Number" },
    { key: "clinicAddress", label: "Clinic Address" },
    { key: "city", label: "City" },
    { key: "state", label: "State" },
  ];

  return (
    <main className="docdash">
      <section className="docdash-card">
        <header className="docdash-header">
          <h2>Doctor Profile</h2>
          <p>Welcome back, Dr. {doctorData.name?.split(" ")[0]}</p>
        </header>

        {!isEditing ? (
          <div className="docdash-info">
            {fields.map(({ key, label }) => (
              <div className="docdash-row" key={key}>
                <span className="label">{label}</span>
                <span className="value">{doctorData[key] || "-"}</span>
              </div>
            ))}

            <div className="docdash-btns">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
              <Link className="edit-btn" to="/doctor/appointments">
                View Appointments
              </Link>
            </div>
          </div>
        ) : (
          <form className="docdash-form" onSubmit={handleSubmit}>
            {fields.map(({ key, label }) => (
              <div key={key} className="input-group">
                <label>{label}</label>
                <input
                  type={key === "experience" ? "number" : "text"}
                  name={key}
                  value={formData[key] || ""}
                  onChange={handleChange}
                  disabled={key === "email"}
                />
              </div>
            ))}

            <div className="docdash-actions">
              <button type="button" className="cancel" onClick={() => setIsEditing(false)}>
                Cancel
              </button>
              <button type="submit" className="save">
                Save Changes
              </button>
            </div>
          </form>
        )}
      </section>
    </main>
  );
};

export default DoctorDashboard;
