import React, { useEffect, useState } from 'react';
import axios from 'axios';
import '../styles/doctordashboard.css'; // Make sure this file is correctly imported

const DoctorDashboard = () => {
  const [doctorData, setDoctorData] = useState(null);
  const [formData, setFormData] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const fetchDoctorData = async () => {
      try {
        const storedEmail = localStorage.getItem('email');
        if (!storedEmail) {
          console.error('Email not found in localStorage');
          return;
        }

        const encodedEmail = encodeURIComponent(storedEmail);
        const response = await axios.get(`http://localhost:5000/api/doctors/${encodedEmail}`);

        if (response.data) {
          setDoctorData(response.data);
          setFormData(response.data);
        }
      } catch (error) {
        console.error('Error fetching doctor data:', error.response?.data || error.message);
      }
    };

    fetchDoctorData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (!formData) return;

      const updatedData = { ...formData, email: doctorData.email };

      const response = await axios.put(
        `http://localhost:5000/api/doctors/update`,
        updatedData
      );

      setDoctorData(response.data.doctor);
      alert('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error.response?.data || error.message);
      alert('Failed to update profile. Check console for details.');
    }
  };

  const closeModal = () => setIsEditing(false);

  if (!doctorData) {
    return <div className="container mt-5 text-center">Loading...</div>;
  }

  const displayFields = [
    { key: 'name', label: 'Name' },
    { key: 'email', label: 'Email' },
    { key: 'specialization', label: 'Specialization' },
    { key: 'experience', label: 'Experience' },
    { key: 'phone', label: 'Phone' },
    { key: 'clinicAddress', label: 'Clinic Address' },
    { key: 'city', label: 'City' },
    { key: 'state', label: 'State' },
  ];

  return (
    <div className="container mt-5 doctor-dashboard-container">
      {isEditing && (
        <div
          className="custom-modal-backdrop"
          onClick={closeModal}
        />
      )}

      <div className="card p-4 shadow" style={{ position: 'relative', zIndex: 2 }}>
        <h2 className="mb-4 text-center">Doctor Profile</h2>

        {!isEditing ? (
          <>
            <table className="user-info-table">
              <tbody>
                {displayFields.map(({ key, label }, index) => (
                  <tr key={key} className={index % 2 === 0 ? 'even-row' : ''}>
                    <td className="label-col">{label}</td>
                    <td className="colon-col">:</td>
                    <td className="value-col">{doctorData[key] || '-'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="text-center">
              <button className="btn btn-primary mt-4" onClick={() => setIsEditing(true)}>
                Edit Profile
              </button>
            </div>
          </>
        ) : (
          <form onSubmit={handleSubmit}>
            {displayFields
              .filter(({ key }) => key !== 'email')
              .map(({ key, label }) => (
                <div className="mb-3" key={key}>
                  <label className="form-label">{label}:</label>
                  <input
                    type={key === 'experience' ? 'number' : 'text'}
                    name={key}
                    value={formData[key] || ''}
                    onChange={handleChange}
                    className="form-control"
                    required
                  />
                </div>
              ))}

            <div className="mb-3">
              <label className="form-label">Email:</label>
              <input
                type="email"
                name="email"
                value={formData.email || ''}
                className="form-control"
                disabled
              />
            </div>

            <div className="d-flex justify-content-between">
              <button type="submit" className="btn btn-success">Save</button>
              <button type="button" className="btn btn-secondary" onClick={closeModal}>
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>

      {/* Quote */}
      <div className="doctor-dashboard-quote text-center mt-4">
        <blockquote>
          "Saving lives is not just a profession, it's a calling.<br />
          Your expertise, compassion, and dedication make healthcare truly healing."
        </blockquote>
      </div>
    </div>
  );
};

export default DoctorDashboard;
