import { useEffect, useState } from "react";
import api from "../api/client";
import "../styles/UserDashboard.css";

const initialUserData = {
  name: "",
  phone: "",
  dateOfBirth: "",
  gender: "",
  bloodType: "",
  height: "",
  weight: "",
  bmi: "",
  email: "",
  city: "",
  state: "",
  loginId: "",
};

const UserDashboard = () => {
  const [userData, setUserData] = useState(initialUserData);
  const [formData, setFormData] = useState(initialUserData);
  const [isEditing, setIsEditing] = useState(false);

  const fetchUserData = async () => {
    const response = await api.get("/api/user/me");
    const user = response.data.user || response.data;
    setUserData(user);
    setFormData(user);
  };

  useEffect(() => {
    fetchUserData().catch((error) => console.error("Error fetching user data:", error));
  }, []);

  useEffect(() => {
    if (formData.height > 0 && formData.weight > 0) {
      const heightInMeters = formData.height / 100;
      const bmi = (formData.weight / (heightInMeters * heightInMeters)).toFixed(2);
      setFormData((prev) => ({ ...prev, bmi }));
    }
  }, [formData.height, formData.weight]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    const numericFields = ["height", "weight", "phone"];
    setFormData((prev) => ({ ...prev, [name]: numericFields.includes(name) ? Number(value) : value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.put("/api/user/me", formData);
      setUserData(response.data.user);
      setFormData(response.data.user);
      setIsEditing(false);
    } catch (error) {
      alert(error.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="container mt-5">
      <div className="card ">
        <h2 className="mb-4 mt-4 text-center">User Profile</h2>
        <table className="user-info-table">
          <tbody>
            {[
              ["loginId", userData.loginId],
              ["Name", userData.name],
              ["Date of Birth", userData.dateOfBirth?.slice(0, 10)],
              ["Gender", userData.gender],
              ["Blood Type", userData.bloodType],
              ["Height", userData.height],
              ["Weight", userData.weight],
              ["BMI", userData.bmi],
              ["Mobile No", userData.phone],
              ["Email ID", userData.email],
              ["City", userData.city],
              ["State", userData.state],
            ].map(([label, value], index) => (
              <tr key={label} className={index % 2 === 0 ? "even-row" : ""}>
                <td className="label-col">{label}</td>
                <td className="colon-col">:</td>
                <td className="value-col">{value || "-"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <button className="btn btn-primary custom-small-btn mt-3" onClick={() => setIsEditing(true)}>
        Edit Profile
      </button>

      {isEditing && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: "rgba(0,0,0,0.5)" }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button type="button" className="btn-close" onClick={() => setIsEditing(false)} />
              </div>
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {["name", "phone", "gender", "bloodType", "height", "weight", "city", "state"].map((key) => (
                    <div className="mb-3" key={key}>
                      <label className="form-label">{key.charAt(0).toUpperCase() + key.slice(1)}:</label>
                      <input
                        type={["phone", "height", "weight"].includes(key) ? "number" : "text"}
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="form-control"
                      />
                    </div>
                  ))}
                  <div className="mb-3">
                    <label className="form-label">Email:</label>
                    <input type="email" value={formData.email || ""} className="form-control" disabled />
                  </div>
                  <div className="mb-3">
                    <label className="form-label">BMI:</label>
                    <input type="text" value={formData.bmi || "-"} className="form-control" disabled />
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

export default UserDashboard;
