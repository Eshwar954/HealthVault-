import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/requestaccess.css";

const Requestaccess = () => {
  const [patientId, setPatientId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [loading, setLoading] = useState(false);

  const [file, setFile] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [reportType, setReportType] = useState("");
  const [files, setFiles] = useState([]);

  const [activeSection, setActiveSection] = useState("main");

  useEffect(() => {
    if (verified) {
      const start = new Date();
      setSessionStartedAt(start);
      const timer = setTimeout(() => {
        setSessionExpired(true);
        alert("Session expired after 15 minutes. Please verify again.");
        handleEndSession();
      }, 15 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [verified]);

  const handleSendOtp = async () => {
    if (!patientId.trim()) {
      alert("Please enter Patient ID.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/otp/request", {
        loginId: patientId,
      });
      alert(res.data.message || "OTP sent!");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send OTP.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otp.trim()) {
      alert("Please enter OTP.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/otp/verify", {
        loginId: patientId,
        otp,
      });
      if (res.data.message?.toLowerCase().includes("verified")) {
        alert("OTP verified! Access granted.");
        setVerified(true);
      } else {
        alert(res.data.message || "OTP verification failed.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "OTP verification error.");
    } finally {
      setLoading(false);
    }
  };

  const handleAccessRecords = async () => {
    if (!patientId) {
      alert("Patient ID missing.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.get(`http://localhost:5000/api/files/fetch/${patientId}`);
      setFiles(res.data.files || []);
      setActiveSection("access");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to fetch files.");
    } finally {
      setLoading(false);
    }
  };

  const handleUpload = async () => {
    if (!file || !doctorName.trim() || !reportType.trim()) {
      alert("Please fill all fields before uploading.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("loginId", patientId);
    formData.append("doctorName", doctorName);
    formData.append("reportType", reportType);
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/files/doctor/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      alert("File uploaded successfully!");
      setFile(null);
      setDoctorName("");
      setReportType("");
      setActiveSection("main");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = () => {
    setPatientId("");
    setOtp("");
    setOtpSent(false);
    setVerified(false);
    setSessionExpired(false);
    setSessionStartedAt(null);
    setFile(null);
    setDoctorName("");
    setReportType("");
    setFiles([]);
    setActiveSection("main");
  };

  const reportTypes = [
    { group: "General Reports", options: ["General Checkup", "Prescription", "Discharge Summary", "Medical Certificate"] },
    { group: "Lab Tests", options: ["Blood Test", "Urine Test", "Stool Test", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile", "Lipid Profile", "HbA1c (Diabetes)", "Complete Blood Count (CBC)"] },
    { group: "Specialist Reports", options: ["Cardiology", "Neurology", "Orthopedics", "Gastroenterology", "Dermatology", "Pulmonology", "Endocrinology", "Nephrology", "Urology", "ENT (Ear, Nose, Throat)"] },
    { group: "Imaging & Diagnostics", options: ["X-Ray", "MRI", "CT Scan", "Ultrasound", "Echocardiogram (ECHO)", "ECG", "EEG", "PET Scan", "Mammogram"] },
    { group: "Miscellaneous", options: ["Vaccination Record", "Allergy Test", "Mental Health Evaluation", "Vision Test", "Hearing Test", "Dental Report", "Gynecology", "Pediatrics"] },
  ];

  return (
    <div className="request-access-container">
      <div className={`fade-container ${activeSection}`}>
        {!verified && !sessionExpired && (
          <div className="form-container">
            <h2>Request Access</h2>
            <div className="input-group">
              <input
                type="text"
                placeholder="Enter Patient ID"
                value={patientId}
                onChange={(e) => setPatientId(e.target.value)}
                disabled={loading}
                className="input-field"
              />
              {!otpSent ? (
                <button
                  onClick={handleSendOtp}
                  disabled={loading}
                  className="primary-btn"
                >
                  {loading ? "Sending OTP..." : "Send OTP"}
                </button>
              ) : (
                <div className="otp-verify-section">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                    className="input-field"
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading}
                    className="primary-btn"
                  >
                    {loading ? "Verifying OTP..." : "Verify OTP"}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {verified && activeSection === "main" && (
          <div className="options-container">
            <h2>Welcome, Doctor</h2>
            <p>Session started at: {sessionStartedAt?.toLocaleString()}</p>
            <div className="options-grid">
              <button
                onClick={() => setActiveSection("upload")}
                className="option-btn"
              >
                Upload Report
              </button>
              <button  className="option-btn">
                Access Records
              </button>
              <button
                onClick={handleEndSession}
                className="option-btn end-btn"
              >
                End Session
              </button>
            </div>
          </div>
        )}

        {verified && activeSection === "upload" && (
          <div className="upload-section">
            <h2>Upload Medical Report</h2>
            <div className="input-group">
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="input-field file-input"
              />
              <input
                type="text"
                placeholder="Doctor Name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                className="input-field"
              />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                className="input-field select-field"
              >
                <option value="">Select Report Type</option>
                {reportTypes.map((group, index) => (
                  <optgroup key={index} label={group.group}>
                    {group.options.map((type, idx) => (
                      <option key={idx} value={type}>
                        {type}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
              <div className="button-group">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="primary-btn"
                >
                  {loading ? "Uploading..." : "Upload"}
                </button>
                <button
                  onClick={() => setActiveSection("main")}
                  className="secondary-btn"
                >
                  Go Back
                </button>
              </div>
            </div>
          </div>
        )}

        {verified && activeSection === "access" && (
          <div className="access-section">
            <h2>Fetched Records</h2>
            {files.length === 0 ? (
              <p className="no-records">No records available for this patient.</p>
            ) : (
              <div className="file-cards">
                {files.map((file, index) => (
                  <div key={index} className="file-card">
                    <h4>{file.fileName}</h4>
                    <p>Doctor: {file.doctorName}</p>
                    <p>Report Type: {file.reportType}</p>
                    <p>Uploaded: {new Date(file.createdAt).toLocaleString()}</p>
                    <a
                      href={file.fileUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="file-link"
                    >
                      View File
                    </a>
                  </div>
                ))}
              </div>
            )}
            <button
              onClick={() => setActiveSection("main")}
              className="secondary-btn"
            >
              Go Back
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Requestaccess;