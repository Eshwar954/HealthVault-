import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/diagnosticsupload.css";

const OtpFileUpload = () => {
  const [loginId, setLoginId] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [verified, setVerified] = useState(false);
  const [file, setFile] = useState(null);
  const [doctorName, setDoctorName] = useState("");
  const [reportType, setReportType] = useState("");
  const [loading, setLoading] = useState(false);
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [sessionStartedAt, setSessionStartedAt] = useState(null);
  const [sessionExpired, setSessionExpired] = useState(false);
  const [diagnosticCenterName, setDiagnosticCenterName] = useState("");
  const [fileName, setFileName] = useState("Choose a file...");

  useEffect(() => {
    if (verified) {
      const start = new Date();
      setSessionStartedAt(start);
      const timer = setTimeout(() => {
        setSessionExpired(true);
        alert("Session expired after 15 minutes. Please login again.");
        handleEndSession();
      }, 15 * 60 * 1000);
      return () => clearTimeout(timer);
    }
  }, [verified]);

  const handleSendOtp = async () => {
    if (!loginId.trim()) {
      alert("Please enter login ID.");
      return;
    }
    setLoading(true);
    try {
      const res = await axios.post("http://localhost:5000/api/otp/request", {
        loginId,
      });
      alert(res.data.message || "OTP sent!");
      setOtpSent(true);
    } catch (err) {
      alert(err.response?.data?.message || "OTP request failed.");
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
        loginId,
        otp,
      });
      if (res.data.message?.toLowerCase().includes("verified")) {
        alert("OTP verified!");
        setVerified(true);
      } else {
        alert(res.data.message || "OTP not verified.");
      }
    } catch (err) {
      alert(err.response?.data?.message || "Verification failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    setFile(selectedFile);
    setFileName(selectedFile ? selectedFile.name : "Choose a file...");
  };

  const handleUpload = async () => {
    if (!file || !doctorName.trim() || !reportType.trim() || !diagnosticCenterName.trim()) {
      alert("Please fill all fields including Diagnostic Center Name.");
      return;
    }
    const formData = new FormData();
    formData.append("file", file);
    formData.append("loginId", loginId);
    formData.append("doctorName", doctorName);
    formData.append("reportType", reportType);
    formData.append("diagnosticCenterName", diagnosticCenterName);

    setLoading(true);
    try {
      const res = await axios.post(
        "http://localhost:5000/api/files/diagnostic/upload",
        formData,
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      const uploadedFileInfo = {
        name: file.name,
        uploadedAt: new Date().toLocaleString(),
      };

      setUploadedFiles((prev) => [...prev, uploadedFileInfo]);
      alert("File uploaded!");
      setFile(null);
      setFileName("Choose a file...");
      setDoctorName("");
      setReportType("");
      setDiagnosticCenterName("");
    } catch (err) {
      alert(err.response?.data?.message || "Upload failed.");
    } finally {
      setLoading(false);
    }
  };

  const handleEndSession = () => {
    setLoginId("");
    setOtp("");
    setOtpSent(false);
    setVerified(false);
    setDoctorName("");
    setReportType("");
    setFile(null);
    setFileName("Choose a file...");
    setUploadedFiles([]);
    setSessionExpired(false);
    setSessionStartedAt(null);
    setDiagnosticCenterName("");
  };

  const reportTypes = [
    { group: "General Reports", options: ["General Checkup", "Prescription", "Discharge Summary", "Medical Certificate"] },
    { group: "Lab Tests", options: ["Blood Test", "Urine Test", "Stool Test", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile", "Lipid Profile", "HbA1c (Diabetes)", "Complete Blood Count (CBC)"] },
    { group: "Specialist Reports", options: ["Cardiology", "Neurology", "Orthopedics", "Gastroenterology", "Dermatology", "Pulmonology", "Endocrinology", "Nephrology", "Urology", "ENT (Ear, Nose, Throat)"] },
    { group: "Imaging & Diagnostics", options: ["X-Ray", "MRI", "CT Scan", "Ultrasound", "Echocardiogram (ECHO)", "ECG", "EEG", "PET Scan", "Mammogram"] },
    { group: "Miscellaneous", options: ["Vaccination Record", "Allergy Test", "Mental Health Evaluation", "Vision Test", "Hearing Test", "Dental Report", "Gynecology", "Pediatrics"] },
  ];

  return (
    <div className="otp-upload-container">
      <div className={`otp-upload-card ${verified ? 'otp-upload-verified' : ''}`}>
        <h2>Diagnostic File Upload</h2>

        {!verified && !sessionExpired && (
          <div className="otp-upload-input-group">
            <input
              type="text"
              placeholder="User Login ID"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              disabled={loading}
              className="otp-upload-input-field"
            />
            {!otpSent ? (
              <button
                onClick={handleSendOtp}
                disabled={loading}
                className="otp-upload-primary-btn"
              >
                {loading ? "Sending OTP..." : "Send OTP"}
              </button>
            ) : (
              <div className="otp-upload-otp-verify-section">
                <input
                  type="text"
                  placeholder="Enter OTP"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  disabled={loading}
                  className="otp-upload-input-field"
                />
                <button
                  onClick={handleVerifyOtp}
                  disabled={loading}
                  className="otp-upload-primary-btn"
                >
                  {loading ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}
          </div>
        )}

        {verified && !sessionExpired && (
          <div className="otp-upload-upload-section">
            <div className="otp-upload-session-status">
              Session Active (Expires in 15 mins) — Login ID: {loginId}
            </div>
            <div className="otp-upload-input-group">
              <input
                type="text"
                placeholder="Doctor Name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                disabled={loading}
                className="otp-upload-input-field"
              />
              <input
                type="text"
                placeholder="Diagnostic Center Name"
                value={diagnosticCenterName}
                onChange={(e) => setDiagnosticCenterName(e.target.value)}
                disabled={loading}
                className="otp-upload-input-field"
              />
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                disabled={loading}
                className="otp-upload-select-field"
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
              <div className="otp-upload-file-input-wrapper">
                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={loading}
                  id="otp-upload-file-upload"
                />
                <label htmlFor="otp-upload-file-upload" className="otp-upload-file-input-label">
                  {fileName}
                </label>
              </div>
              <div className="otp-upload-button-group">
                <button
                  onClick={handleUpload}
                  disabled={loading}
                  className="otp-upload-primary-btn"
                >
                  {loading ? "Uploading..." : "Upload File"}
                </button>
                <button
                  onClick={handleEndSession}
                  className="otp-upload-secondary-btn"
                >
                  End Session
                </button>
              </div>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="otp-upload-uploaded-files-list">
                <h4>Uploaded Files</h4>
                <ul>
                  {uploadedFiles.map((file, index) => (
                    <li key={index} className="otp-upload-file-item">
                      <strong>{file.name}</strong>
                      <span>Uploaded at {file.uploadedAt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default OtpFileUpload;
