import React, { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserDashboard.css"; // Ensure this file exists

const UserDashboard = () => {
  const [userData, setUserData] = useState({
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
  });

  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ ...userData });

  // Fetch user data from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const storedEmail = localStorage.getItem("email");
        if (!storedEmail) {
          console.error("Email not found in localStorage");
          return;
        }

        const response = await axios.get(
          `http://localhost:5000/api/user/${storedEmail}`
        );
        if (response.data) {
          const { _id, services, userId, password, ...filteredData } = response.data;

          setUserData(filteredData);
          setFormData(filteredData);
        }
      } catch (error) {
        console.error(
          "Error fetching user data:",
          error.response?.data || error.message
        );
      }
    };

    fetchUserData();
  }, []);

  // BMI Calculation
  useEffect(() => {
    if (formData.height>0 && formData.weight>0) {
      const heightInMeters = formData.height / 100;
      const calculatedBMI = (
        formData.weight /
        (heightInMeters * heightInMeters)
      ).toFixed(2);
      setFormData((prev) => ({
        ...prev,
        bmi: calculatedBMI,
      }));
    }
  }, [formData.height, formData.weight]);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: (name === "height" || name === "weight" || name === "phone") ? Number(value) : value,
    }));
  };
  

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/user/update`,formData);
      setUserData(formData);
      alert("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      console.error(
        "Error updating profile:",
        error.response?.data || error.message
      );
    }
  };

  // Close modal
  const closeModal = () => setIsEditing(false);

  return (
    <div className="container mt-5">
      <div className="card ">
        <h2 className="mb-4 mt-4 text-center">User Profile</h2>

        <table className="user-info-table">
          <tbody>
            {[
              ["loginId", userData.loginId],
              ["Name", userData.name],
              ["Date of Birth", userData.dateOfBirth.slice(0, 10)],
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
          tabIndex="-1"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog">
            <div className="modal-content">
              {/* Modal Header */}
              <div className="modal-header">
                <h5 className="modal-title">Edit Profile</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeModal}
                ></button>
              </div>

              {/* Modal Body */}
              <div className="modal-body">
                <form onSubmit={handleSubmit}>
                  {[
                    "name",
                    "phone",
                    "gender",
                    "bloodType",
                    "height",
                    "weight",
                    "city",
                    "state",
                  ].map((key) => (
                    <div className="mb-3" key={key}>
                      <label className="form-label">
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </label>
                      <input
                        type={
                          
                             key === "phone" ||
                              key === "height" ||
                              key === "weight"
                            ? "number"
                            : "text"
                        }
                        name={key}
                        value={formData[key] || ""}
                        onChange={handleChange}
                        className="form-control"
                        required={
                          key !== "bloodType" &&
                          key !== "city" &&
                          key !== "state"
                        }
                      />
                    </div>
                  ))}

                  {/* Email (Read-Only) */}
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

                  {/* BMI (Calculated) */}
                  <div className="mb-3">
                    <label className="form-label">BMI:</label>
                    <input
                      type="text"
                      value={formData.bmi || "-"}
                      className="form-control"
                      disabled
                    />
                  </div>

                  {/* Submit and Cancel Buttons */}
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

      {/* Modal Overlay */}
      {isEditing && (
        <div className="modal-backdrop fade show" onClick={closeModal}></div>
      )}
    </div>
  );
};

export default UserDashboard;