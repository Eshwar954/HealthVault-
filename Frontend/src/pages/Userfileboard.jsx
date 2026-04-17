import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserFileBoard.css";
const BASE_URL = import.meta.env.VITE_API_URL;

const FileCard = ({ file }) => {
  const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString();
  
  // Use generic document icon or dynamic based on fileType
  const thumbnail = file.fileType?.includes("pdf") 
    ? "https://cdn-icons-png.flaticon.com/512/337/337946.png" 
    : "https://cdn-icons-png.flaticon.com/512/2983/2983067.png"; // generic image icon

  return (
    <div className="file-card">
      <div className="file-header">
        <img src={thumbnail} alt="Format" className="file-thumbnail" />
        <div className="file-title-wrap">
          <h3 className="file-name" title={file.fileName}>{file.fileName}</h3>
          <span className="file-type-badge">
            {file.fileType ? file.fileType.split("/")[1] : "FILE"}
          </span>
        </div>
      </div>

      <div className="file-details">
        <p>
          <span>Doctor:</span>
          <strong>{file.doctorName || "N/A"}</strong>
        </p>
        <p>
          <span>Report:</span>
          <strong>{file.reportType || "N/A"}</strong>
        </p>
        <p>
          <span>Uploaded:</span>
          <strong>{formatDate(file.createdAt)}</strong>
        </p>
      </div>

      <a
        href={file.fileUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="view-link"
      >
        View Document
      </a>
    </div>
  );
};

const UserFileBoard = () => {
  const [files, setFiles] = useState([]);
  const [filteredFiles, setFilteredFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("");
  const [filterType, setFilterType] = useState("");
  const [filterDoctor, setFilterDoctor] = useState("");
  const [filterReport, setFilterReport] = useState("");

  const fetchFiles = async () => {
    const loginId = localStorage.getItem("loginId");
    if (!loginId) return;

    try {
      const response = await axios.get(
        `${BASE_URL}/api/files/fetch/${loginId}`
      );
      setFiles(response.data.files);
      setFilteredFiles(response.data.files);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFiles();
  }, []);

  useEffect(() => {
    let updated = [...files];

    if (searchTerm) {
      updated = updated.filter((file) =>
        file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (filterType) {
      updated = updated.filter((file) => file.fileType === filterType);
    }

    if (filterDoctor) {
      updated = updated.filter((file) => file.doctorName === filterDoctor);
    }

    if (filterReport) {
      updated = updated.filter((file) => file.reportType === filterReport);
    }

    if (sortOrder === "newest") {
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      updated.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredFiles(updated);
  }, [searchTerm, sortOrder, filterType, filterDoctor, filterReport, files]);

  return (
    <div className="file-board-container">
      <h2 className="file-board-heading">My Medical Records</h2>

      <div className="file-controls">
        <div className="search-wrapper">
          <input
            type="text"
            placeholder="Search by file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-row">
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort: Default</option>
            <option value="newest">Sort: Newest First</option>
            <option value="oldest">Sort: Oldest First</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">All Formats</option>
            {[...new Set(files.map((file) => file.fileType).filter(Boolean))].map((type) => (
              <option key={type} value={type}>
                {type.split("/")[1]?.toUpperCase() || type}
              </option>
            ))}
          </select>

          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="">All Doctors</option>
            {[...new Set(files.map((file) => file.doctorName).filter(Boolean))].map(
              (doctor) => (
                <option key={doctor} value={doctor}>
                  {doctor}
                </option>
              )
            )}
          </select>

          <select
            value={filterReport}
            onChange={(e) => setFilterReport(e.target.value)}
          >
            <option value="">All Report Types</option>
            {[...new Set(files.map((file) => file.reportType).filter(Boolean))].map(
              (report) => (
                <option key={report} value={report}>
                  {report}
                </option>
              )
            )}
          </select>
        </div>
      </div>

      {loading ? (
        <div className="empty-state">Loading your records...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="empty-state">
          {files.length === 0 
            ? "No medical records found in your vault." 
            : "No records match your search filters."}
        </div>
      ) : (
        <div className="file-grid">
          {filteredFiles.map((file) => (
            <FileCard key={file._id} file={file} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserFileBoard;
