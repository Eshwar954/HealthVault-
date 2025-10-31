import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/doctordashboard.css";

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) return;
        const encodedEmail = encodeURIComponent(storedEmail);
        const res = await axios.get(
          `http://localhost:5000/api/doctors/${encodedEmail}`
        );
        if (res.data) {
          setDoctorData(res.data);
          setFormData(res.data);
        }
      } catch (err) {
        console.error("Error fetching doctor data:", err);
      }
    };
    fetchDoctorData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const updated = { ...formData, email: doctorData.email };
      const res = await axios.put(
        "http://localhost:5000/api/doctors/update",
        updated
      );
      setDoctorData(res.data.doctor);
      setIsEditing(false);
      alert("Profile updated successfully!");
    } catch (err) {
      console.error("Error updating profile:", err);
      alert("Failed to update profile");
    }
  };

  if (!doctorData)
    return <div className="docdash-loader">Loading your dashboard...</div>;

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
          <p>Welcome back, Dr. {doctorData.name?.split(" ")[0]} 👋</p>
        </header>

        {!isEditing ? (
          <div className="docdash-info">
            {fields.map(({ key, label }) => (
              <div className="docdash-row" key={key}>
                <span className="label">{label}</span>
                <span className="value">{doctorData[key] || "—"}</span>
              </div>
            ))}

            <div className="docdash-btns">
              <button className="edit-btn" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
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

      <footer className="docdash-footer">
        <blockquote>
          “Healing is a matter of time, but it is sometimes also a matter of opportunity.”
          <br /> — Hippocrates
        </blockquote>
      </footer>
    </main>
  );
};

export default DoctorDashboard;
