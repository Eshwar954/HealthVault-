import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../api/client";
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

  const fetchDiagnosticData = async () => {
    const res = await api.get("/api/diagnostic/me");
    const diagnostic = res.data.diagnostic;
    setDiagnosticData(diagnostic);
    setFormData(diagnostic);
  };

  useEffect(() => {
    fetchDiagnosticData().catch((error) => console.error("Error fetching diagnostic data:", error));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleServicesChange = (e) => {
    const services = e.target.value.split(",").map((service) => service.trim()).filter(Boolean);
    setFormData((prev) => ({ ...prev, services }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.put("/api/diagnostic/me", formData);
      setDiagnosticData(res.data.diagnostic);
      setFormData(res.data.diagnostic);
      setIsEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card">
        <h2 className="mb-4 mt-4 text-center">Diagnostic Center Profile</h2>
        <table className="user-info-table">
          <tbody>
            {["loginId", "name", "email", "role", "address"].map((key, index) => (
              <tr key={key} className={index % 2 === 0 ? "even-row" : ""}>
                <td className="label-col">{key.charAt(0).toUpperCase() + key.slice(1)}</td>
                <td className="colon-col">:</td>
                <td className="value-col">{diagnosticData[key] || "-"}</td>
              </tr>
            ))}
            <tr className="even-row">
              <td className="label-col">Services</td>
              <td className="colon-col">:</td>
              <td className="value-col">
                {Array.isArray(diagnosticData.services) ? diagnosticData.services.join(", ") : "-"}
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="d-flex gap-2 mt-3">
        <button className="btn btn-primary custom-small-btn" onClick={() => setIsEditing(true)}>
          Edit Profile
        </button>
        <Link className="btn btn-primary custom-small-btn" to="/diagnostic/orders">
          View Orders
        </Link>
      </div>

      {isEditing && (
        <div className="modal fade show d-block" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Diagnostic Profile</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)} />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {["name", "address"].map((key) => (
                    <div className="mb-3" key={key}>
                      <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
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
                  <div className="mb-3">
                    <label className="form-label">Services (comma-separated):</label>
                    <input
                      type="text"
                      name="services"
                      value={Array.isArray(formData.services) ? formData.services.join(", ") : ""}
                      onChange={handleServicesChange}
                      className="form-control"
                    />
                  </div>
                  <div className="d-flex justify-content-between">
                    <button type="submit" className="btn btn-success">
                      Save
                    </button>
                    <button type="button" className="btn btn-secondary" onClick={() => setIsEditing(false)}>
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DiagnosticDashboard;
