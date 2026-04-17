import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "../styles/uploadfile.css";
const BASE_URL = import.meta.env.VITE_API_URL;

const UploadFile = () => {
  const navigate = useNavigate();
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reportType, setReportType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFiles = async () => {
    const loginId = localStorage.getItem("loginId");
    if (!loginId) {
      navigate("/login");
      return;
    }

    try {
      const response = await axios.get(
        `${BASE_URL}/api/files/fetch/${loginId}`
      );
      setUploadedFiles(response.data.files || []);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, [navigate]);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!fileName) {
        setFileName(selectedFile.name.split('.')[0]); // Default name to original filename without extension
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !fileName.trim() || !doctorName.trim() || !reportType.trim()) {
      alert("Please fill all fields and select a file.");
      return;
    }

    const loginId = localStorage.getItem("loginId");
    if (!loginId) {
      alert("Session expired. Please log in again.");
      navigate("/login");
      return;
    }

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("doctorName", doctorName);
    formData.append("reportType", reportType);
    formData.append("loginId", loginId);

    try {
      await axios.post(`${BASE_URL}/api/files/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully");
      setFile(null);
      setFileName("");
      setDoctorName("");
      setReportType("");
      fetchFiles();
    } catch (error) {
      console.error("Upload Error:", error);
      alert(`Upload failed: ${error.response?.data?.message || "Internal server error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await axios.delete(`${BASE_URL}/api/files/delete/${fileId}`);
      fetchFiles();
    } catch (error) {
      alert(`Failed to delete file: ${error.response?.data?.message || error.message}`);
    }
  };

  const reportTypes = [
    { group: "General Reports", options: ["General Checkup", "Prescription", "Discharge Summary", "Medical Certificate"] },
    { group: "Lab Tests", options: ["Blood Test", "Urine Test", "Stool Test", "Liver Function Test (LFT)", "Kidney Function Test (KFT)", "Thyroid Profile", "Lipid Profile", "HbA1c (Diabetes)", "Complete Blood Count (CBC)"] },
    { group: "Specialist Reports", options: ["Cardiology", "Neurology", "Orthopedics", "Gastroenterology", "Dermatology", "Pulmonology", "Endocrinology", "Nephrology", "Urology", "ENT (Ear, Nose, Throat)"] },
    { group: "Imaging & Diagnostics", options: ["X-Ray", "MRI", "CT Scan", "Ultrasound", "Echocardiogram (ECHO)", "ECG", "EEG", "PET Scan", "Mammogram"] },
    { group: "Miscellaneous", options: ["Vaccination Record", "Allergy Test", "Mental Health Evaluation", "Vision Test", "Hearing Test", "Dental Report", "Gynecology", "Pediatrics"] }
  ];

  return (
    <div className="upload-dashboard">
      {/* Upload Form Card */}
      <section className="upload-card">
        <h2>Upload Medical Report</h2>
        <form className="upload-form" onSubmit={handleUpload}>
          <div className="form-group">
            <label>File Name</label>
            <input
              type="text"
              placeholder="e.g., CBC Blood Test Jan 2026"
              value={fileName}
              onChange={(e) => setFileName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Prescribing Doctor</label>
            <input
              type="text"
              placeholder="Dr. John Doe"
              value={doctorName}
              onChange={(e) => setDoctorName(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label>Report Type</label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              required
            >
              <option value="">Select Report Type</option>
              {reportTypes.map((group, idx) => (
                <optgroup key={idx} label={group.group}>
                  {group.options.map((opt, i) => (
                    <option key={i} value={opt}>{opt}</option>
                  ))}
                </optgroup>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select File</label>
            <div className="file-input-wrapper">
              <input type="file" onChange={handleFileChange} required={!file} />
              <span className="file-input-btn">
                {file ? file.name : "Choose a file or drag it here"}
              </span>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </section>

      {/* Recent Files Table */}
      <section className="recent-files-card">
        <h3>My Uploaded Files</h3>
        
        {uploadedFiles.length === 0 ? (
          <div className="empty-state">
            <p>No files uploaded yet.</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="recent-files-table">
              <thead>
                <tr>
                  <th>File Name</th>
                  <th>Type</th>
                  <th>Doctor</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {uploadedFiles.map((f) => (
                  <tr key={f._id}>
                    <td>{f.fileName}</td>
                    <td>{f.reportType}</td>
                    <td>{f.doctorName}</td>
                    <td className="action-links">
                      <a
                        href={f.fileUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="view-link"
                      >
                        View
                      </a>
                      <button
                        onClick={() => handleDelete(f._id)}
                        className="delete-btn"
                        title="Delete File"
                      >
                        ✖
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </div>
  );
};

export default UploadFile;
