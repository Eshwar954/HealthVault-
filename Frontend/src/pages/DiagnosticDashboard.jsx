import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserDashboard.css";

const DiagnosticDashboard = () => {
  const [diagnosticData, setDiagnosticData] = useState({
    loginId: "",
    name: "",
    email: "",
    role: "",
    services: [],
    address: "",
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...diagnosticData });

  useEffect(() => {
    const fetchDiagnosticData = async () => {
      try {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
          console.error("Email not found in localStorage");
          return;
        }

        const res = await axios.get(
          `http://localhost:5000/api/diagnostic?email=${storedEmail}`
        );
        if (res.data && res.data.diagnostic) {
          const { _id, password, ...filteredData } = res.data.diagnostic;
          setDiagnosticData(filteredData);
          setFormData(filteredData);
        }
      } catch (error) {
        console.error("Error fetching diagnostic data:", error.message);
      }
    };

    fetchDiagnosticData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (e) => {
    const servicesArray = e.target.value.split(",").map((s) => s.trim());
    setFormData((prev) => ({ ...prev, services: servicesArray }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put("http://localhost:5000/api/diagnostic/update", formData);
      setDiagnosticData(formData);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error("Error updating diagnostic profile:", error);
    }
  };

  const closeModal = () => setIsEditing(false);

  return (
    <div className="container mt-5">
      <div className="card">
        <h2 className="mb-4 mt-4 text-center">Diagnostic Center Profile</h2>

        <table className="user-info-table">
          <tbody>
            {["loginId", "name", "email", "role", "address"].map(
              (key, index) => (
                <tr key={key} className={index % 2 === 0 ? "even-row" : ""}>
                  <td className="label-col">
                    {key.charAt(0).toUpperCase() + key.slice(1)}
                  </td>
                  <td className="colon-col">:</td>
                  <td className="value-col">{diagnosticData[key] || "-"}</td>
                </tr>
              )
            )}
            <tr className="even-row">
              <td className="label-col">Services</td>
              <td className="colon-col">:</td>
              <td className="value-col">
                {Array.isArray(diagnosticData.services)
                  ? diagnosticData.services.join(", ")
                  : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <button
        className="btn btn-primary custom-small-btn mt-3"
        onClick={() => setIsEditing(true)}
      >
        Edit Profile
      </button>

      {/* Modal */}
      {isEditing && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Diagnostic Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {["name", "address"].map((key) => (
                    <div className="mb-3" key={key}>
                      <label className="form-label">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </label>
                      <input
                        type="text"
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="form-control"
                        required
                      />
                    </div>
                  ))}

                  {/* Email - Read Only */}
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email || ""}
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">Role:</label>
                    <input
                      type="text"
                      name="role"
                      value={formData.role || ""}
                      className="form-control"
                      disabled
                    />
                  </div>

                  {/* Services */}
                  <div className="mb-3">
                    <label className="form-label">
                      Services (comma-separated):
                    </label>
                    <input
                      type="text"
                      name="services"
                      value={formData.services.join(", ")}
                      onChange={handleServicesChange}
                      className="form-control"
                    />
                  </div>

                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={closeModal}
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}

      {isEditing && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default DiagnosticDashboard;
