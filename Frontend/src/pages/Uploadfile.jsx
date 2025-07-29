import { useState, useEffect } from "react";
import axios from "axios";
import "../styles/uploadfile.css"; // Ensure this file exists

const UploadFile = () => {
  const [file, setFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [doctorName, setDoctorName] = useState("");
  const [reportType, setReportType] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState([]);
  const [isPanelOpen, setIsPanelOpen] = useState(false); // Side panel state

  // Ensure controlled inputs by providing empty strings as default values
  const handleFileChange = (e) => setFile(e.target.files[0]);

  const handleUpload = async () => {
    if (!file || !fileName.trim() || !doctorName.trim() || !reportType.trim()) {
      alert("Please fill all fields");
      return;
    }

    const loginId = localStorage.getItem("loginId");
    if (!loginId) {
      alert("Login ID not found. Please log in.");
      return;
    }

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", fileName);
    formData.append("doctorName", doctorName);
    formData.append("reportType", reportType);
    formData.append("loginId", loginId);

    console.log("Uploading file:", formData.get("file"));
    console.log("File name:", formData.get("fileName"));
    console.log("Doctor name:", formData.get("doctorName"));
    console.log("Report type:", formData.get("reportType"));

    try {
      await axios.post("http://localhost:5000/api/files/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("File uploaded successfully");
      fetchFiles();
      setIsPanelOpen(false); // Close panel after upload
    } catch (error) {
      console.error("Upload Error:", error.response?.data || error.message);
      alert(`Upload failed: ${error.response?.data?.message || error.message}`);
    }
  };

  const fetchFiles = async () => {
    const loginId = localStorage.getItem("loginId");
    if (!loginId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/fetch/${loginId}`
      );
      setUploadedFiles(response.data.files);
    } catch (error) {
      alert(
        `Failed to fetch files: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  const handleDelete = async (fileId) => {
    try {
      await axios.delete(`http://localhost:5000/api/files/delete/${fileId}`);
      alert("File deleted successfully");
      fetchFiles();
    } catch (error) {
      alert(
        `Failed to delete file: ${
          error.response?.data?.message || error.message
        }`
      );
    }
  };

  return (
    <div className="upload-container">
      {/* Upload Button */}
      <div className="upload-header">
        <h2>Upload Medical Reports</h2>
        <button className="open-panel-btn" onClick={() => setIsPanelOpen(true)}>
          Upload
        </button>
      </div>

      {/* Sliding Panel */}
      <div className={`side-panel ${isPanelOpen ? "open" : ""}`}>
        <button
          className="close-panel-btn"
          onClick={() => setIsPanelOpen(false)}
        >
          ✖
        </button>
        <h3>Upload Report</h3>
        <input
          type="text"
          placeholder="File Name"
          value={fileName || ""}
          onChange={(e) => setFileName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Doctor's Name"
          value={doctorName || ""}
          onChange={(e) => setDoctorName(e.target.value)}
        />
        <select
          value={reportType || ""}
          onChange={(e) => setReportType(e.target.value)}
        >
          <option value="">Select Report Type</option>

          {/* General */}
          <option value="General Checkup">General Checkup</option>
          <option value="Prescription">Prescription</option>
          <option value="Discharge Summary">Discharge Summary</option>
          <option value="Medical Certificate">Medical Certificate</option>

          {/* Lab Tests */}
          <option value="Blood Test">Blood Test</option>
          <option value="Urine Test">Urine Test</option>
          <option value="Stool Test">Stool Test</option>
          <option value="Liver Function Test (LFT)">
            Liver Function Test (LFT)
          </option>
          <option value="Kidney Function Test (KFT)">
            Kidney Function Test (KFT)
          </option>
          <option value="Thyroid Profile">Thyroid Profile</option>
          <option value="Lipid Profile">Lipid Profile</option>
          <option value="HbA1c (Diabetes)">HbA1c (Diabetes)</option>
          <option value="Complete Blood Count (CBC)">
            Complete Blood Count (CBC)
          </option>

          {/* Specialist Reports */}
          <option value="Cardiology">Cardiology</option>
          <option value="Neurology">Neurology</option>
          <option value="Orthopedics">Orthopedics</option>
          <option value="Gastroenterology">Gastroenterology</option>
          <option value="Dermatology">Dermatology</option>
          <option value="Pulmonology">Pulmonology</option>
          <option value="Endocrinology">Endocrinology</option>
          <option value="Nephrology">Nephrology</option>
          <option value="Urology">Urology</option>
          <option value="ENT (Ear, Nose, Throat)">
            ENT (Ear, Nose, Throat)
          </option>

          {/* Imaging & Diagnostics */}
          <option value="X-Ray">X-Ray</option>
          <option value="MRI">MRI</option>
          <option value="CT Scan">CT Scan</option>
          <option value="Ultrasound">Ultrasound</option>
          <option value="Echocardiogram (ECHO)">Echocardiogram (ECHO)</option>
          <option value="ECG">ECG</option>
          <option value="EEG">EEG</option>
          <option value="PET Scan">PET Scan</option>
          <option value="Mammogram">Mammogram</option>

          {/* Miscellaneous */}
          <option value="Vaccination Record">Vaccination Record</option>
          <option value="Allergy Test">Allergy Test</option>
          <option value="Mental Health Evaluation">
            Mental Health Evaluation
          </option>
          <option value="Vision Test">Vision Test</option>
          <option value="Hearing Test">Hearing Test</option>
          <option value="Dental Report">Dental Report</option>
          <option value="Gynecology">Gynecology</option>
          <option value="Pediatrics">Pediatrics</option>
        </select>

        <input type="file" onChange={handleFileChange} />
        <button type="button" onClick={handleUpload}>
          Submit
        </button>
      </div>

      {/* Recent Files Table */}
      <div className="recent-files">
        <h3>Recent Files</h3>
        <table>
          <thead>
            <tr>
              <th>File Name</th>
              <th>Report Type</th>
              <th>Doctor</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {uploadedFiles.map((file) => (
              <tr key={file._id}>
                <td>{file.fileName}</td>
                <td>{file.reportType}</td>
                <td>{file.doctorName}</td>
                <td>
                  <a
                    href={file.fileUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="view-link"
                  >
                    VIEW
                  </a>
                  <button
                    onClick={() => handleDelete(file._id)}
                    style={{
                      background: "none",
                      border: "none",
                      fontSize: "1.2rem",
                      color: "#dc3545",
                      cursor: "pointer",
                      marginLeft: "1rem",
                    }}
                  >
                    <i className="fas fa-trash-alt"></i>
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UploadFile;
