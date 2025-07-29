/* eslint-disable react/prop-types */
// UserFileBoard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import "../styles/UserFileBoard.css";

const FileCard = ({ file }) => {
  const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString();
  const thumbnail = "https://cdn-icons-png.flaticon.com/512/337/337946.png";

  return (
    <div className="file-card">
      <img src={thumbnail} alt="File Thumbnail" className="file-thumbnail" />
      <div className="file-info">
        <h3 className="file-name">{file.fileName}</h3>
        <p>
          <strong>Doctor:</strong> {file.doctorName}
        </p>
        <p>
          <strong>Report:</strong> {file.reportType}
        </p>
        <p>
          <strong>Uploaded:</strong> {formatDate(file.createdAt)}
        </p>
        <a
          href={file.fileUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="view-link"
        >
          View File
        </a>
      </div>
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
  const [filterDate, setFilterDate] = useState("");

  const fetchFiles = async () => {
    const loginId = localStorage.getItem("loginId");
    if (!loginId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/fetch/${loginId}`
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

  const fetchFilesWithLimit = async () => {
    const loginId = localStorage.getItem("loginId");
    if (!loginId) return;

    try {
      const response = await axios.get(
        `http://localhost:5000/api/files/userboard/${loginId}?limit=2`
      );
      setFiles(response.data.files);
      setFilteredFiles(response.data.files);
    } catch (error) {
      console.error("Failed to fetch files:", error);
    } finally {
      setLoading(false);
    }
  }

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

    if (filterDate) {
      updated = updated.filter((file) => file.createdAt.slice(0,10) === filterDate);
    }

    if (sortOrder === "newest") {
      updated.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (sortOrder === "oldest") {
      updated.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    }

    setFilteredFiles(updated);
  }, [searchTerm, sortOrder, filterType, filterDoctor, files, filterReport, filterDate]);

  return (
    <div className="file-board-container">
      <h2 className="file-board-heading">Your Files</h2>

      <div className="file-controls">
        <div style={{ width: "100%" }}>
          <input
            type="text"
            placeholder="Search by file name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: "100%" }}
          />
        </div>

        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "1rem",
            justifyContent: "center",
            marginTop: "1rem",          }}
        >
          <select
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
          >
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <select
            value={filterType}
            onChange={(e) => setFilterType(e.target.value)}
          >
            <option value="">Filter by File Type</option>
            {[...new Set(files.map((file) => file.fileType))].map((type) => (
              <option key={type} value={type}>
                {type.split("/")[1].toUpperCase()}
              </option>
            ))}
          </select>

          <select
            value={filterDoctor}
            onChange={(e) => setFilterDoctor(e.target.value)}
          >
            <option value="">Filter by Doctor</option>
            {[...new Set(files.map((file) => file.doctorName))].map(
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
            <option value="">Filter by Report Type</option>
            {[...new Set(files.map((file) => file.reportType))].map(
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
        <p>Loading files...</p>
      ) : filteredFiles.length === 0 ? (
        <p>No files available.</p>
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
