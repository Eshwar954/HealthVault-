import React, { useState, useEffect } from "react";
import axios from "axios";
import "../styles/diagnosticsupload.css";
const BASE_URL = import.meta.env.VITE_API_URL;

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
      const res = await axios.post(`${BASE_URL}/api/otp/request`, {
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
      const res = await axios.post(`${BASE_URL}/api/otp/verify`, {
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
    if (selectedFile) {
      setFile(selectedFile);
      setFileName(selectedFile.name);
    }
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
        `${BASE_URL}/api/files/diagnostic/upload`,
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
      alert("File uploaded successfully!");
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
    <div className="diagnostic-upload-dashboard">
      <section className={`diag-card ${verified ? 'verified' : ''}`}>
        
        <header className="diag-header">
          <h2>Diagnostic File Upload</h2>
          <p>Securely upload records directly to patient profiles.</p>
        </header>

        {!verified && !sessionExpired && (
          <div className="diag-form">
            <div className="form-group">
              <label>Patient Login ID</label>
              <div className="otp-row">
                <input
                  type="text"
                  placeholder="e.g. USR123"
                  value={loginId}
                  onChange={(e) => setLoginId(e.target.value)}
                  disabled={loading || otpSent}
                />
                {!otpSent ? (
                  <button
                    onClick={handleSendOtp}
                    disabled={loading || !loginId}
                    className="btn-primary"
                  >
                    {loading ? "Sending..." : "Send OTP"}
                  </button>
                ) : (
                  <button className="btn-secondary" disabled>OTP Sent</button>
                )}
              </div>
            </div>

            {otpSent && (
              <div className="form-group">
                <label>Verification OTP</label>
                <div className="otp-row">
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    disabled={loading}
                  />
                  <button
                    onClick={handleVerifyOtp}
                    disabled={loading || !otp}
                    className="btn-primary"
                  >
                    {loading ? "Verifying..." : "Verify OTP"}
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {verified && !sessionExpired && (
          <div className="diag-form">
            <div className="session-badge">
              ✓ Session Active for {loginId} (Expires in 15 mins)
            </div>

            <div className="form-group">
              <label>Diagnostic Center Name</label>
              <input
                type="text"
                placeholder="e.g. City Central Labs"
                value={diagnosticCenterName}
                onChange={(e) => setDiagnosticCenterName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Prescribing Doctor (Optional)</label>
              <input
                type="text"
                placeholder="Doctor's Name"
                value={doctorName}
                onChange={(e) => setDoctorName(e.target.value)}
                disabled={loading}
              />
            </div>

            <div className="form-group">
              <label>Report Type</label>
              <select
                value={reportType}
                onChange={(e) => setReportType(e.target.value)}
                disabled={loading}
              >
                <option value="">Select Report Type</option>
                {reportTypes.map((group, index) => (
                  <optgroup key={index} label={group.group}>
                    {group.options.map((type, idx) => (
                      <option key={idx} value={type}>{type}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label>Select File</label>
              <div className="file-input-wrapper">
                <input
                  type="file"
                  onChange={handleFileChange}
                  disabled={loading}
                />
                <span className="file-input-btn">
                  {fileName}
                </span>
              </div>
            </div>

            <div className="action-row">
              <button
                onClick={handleUpload}
                disabled={loading}
                className="btn-primary"
              >
                {loading ? "Uploading..." : "Upload File"}
              </button>
              <button
                onClick={handleEndSession}
                className="btn-secondary"
              >
                End Session
              </button>
            </div>

            {uploadedFiles.length > 0 && (
              <div className="uploaded-list">
                <h4>Recently Uploaded</h4>
                <ul>
                  {uploadedFiles.map((f, index) => (
                    <li key={index} className="uploaded-item">
                      <strong>{f.name}</strong>
                      <span>{f.uploadedAt}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
      </section>
    </div>
  );
};

export default OtpFileUpload;
