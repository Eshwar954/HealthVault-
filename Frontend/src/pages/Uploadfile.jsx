import { useEffect, useState } from "react";
import api from "../api/client";
import "../styles/uploadfile.css";

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reportType, setReportType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isUploading, setIsUploading] = useState(false);

  const fetchFiles = async () => {
    const response = await api.get("/api/files/me");
    setUploadedFiles(response.data.files || []);
  };

  useEffect(() => {
    fetchFiles().catch((error) => console.error("Failed to fetch files:", error));
  }, []);

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(selectedFile);
      if (!fileName) setFileName(selectedFile.name.split(".")[0]);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file || !fileName.trim() || !doctorName.trim() || !reportType.trim()) {
      alert("Please fill all fields and select a file.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("doctorName", doctorName);
    formData.append("reportType", reportType);

    setIsUploading(true);
    try {
      await api.post("/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setFileName("");
      setDoctorName("");
      setReportType("");
      fetchFiles();
    } catch (error) {
      alert(`Upload failed: ${error.response?.data?.message || "Internal server error"}`);
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (fileId) => {
    if (!window.confirm("Are you sure you want to delete this file?")) return;
    try {
      await api.delete(`/api/files/${fileId}`);
      fetchFiles();
    } catch (error) {
      alert(`Failed to delete file: ${error.response?.data?.message || error.message}`);
    }
  };

  const reportTypes = [
    "General Checkup",
    "Prescription",
    "Discharge Summary",
    "Medical Certificate",
    "Blood Test",
    "Urine Test",
    "Liver Function Test (LFT)",
    "Kidney Function Test (KFT)",
    "Thyroid Profile",
    "Lipid Profile",
    "HbA1c (Diabetes)",
    "Complete Blood Count (CBC)",
    "Cardiology",
    "Neurology",
    "Orthopedics",
    "X-Ray",
    "MRI",
    "CT Scan",
    "Ultrasound",
    "ECG",
  ];

  return (
    <div className="upload-dashboard">
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
            <select value={reportType} onChange={(e) => setReportType(e.target.value)} required>
              <option value="">Select Report Type</option>
              {reportTypes.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Select File</label>
            <div className="file-input-wrapper">
              <input type="file" onChange={handleFileChange} required={!file} />
              <span className="file-input-btn">{file ? file.name : "Choose a file"}</span>
            </div>
          </div>

          <button type="submit" className="submit-btn" disabled={isUploading}>
            {isUploading ? "Uploading..." : "Upload File"}
          </button>
        </form>
      </section>

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
                      <a href={f.fileUrl} target="_blank" rel="noopener noreferrer" className="view-link">
                        View
                      </a>
                      <button onClick={() => handleDelete(f._id)} className="delete-btn" title="Delete File">
                        x
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
