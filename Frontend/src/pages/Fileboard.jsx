// FileBoard.jsx
import "../styles/UserFileBoard.css";

const FileCard = ({ file }) => {
  const formatDate = (isoDate) => new Date(isoDate).toLocaleDateString();
  const thumbnail = "https://cdn-icons-png.flaticon.com/512/337/337946.png";

  return (
    <div className="file-card">
      <img src={thumbnail} alt="File Thumbnail" className="file-thumbnail" />
      <div className="file-info">
        <h3 className="file-name">{file.fileName}</h3>
        <p><strong>Doctor:</strong> {file.doctorName}</p>
        <p><strong>Report:</strong> {file.reportType}</p>
        <p><strong>Uploaded:</strong> {formatDate(file.createdAt)}</p>
        <a href={file.fileUrl} target="_blank" rel="noopener noreferrer" className="view-link">
          View File
        </a>
      </div>
    </div>
  );
};

const FileBoard = ({
  files = [],
  searchTerm,
  setSearchTerm,
  sortOrder,
  setSortOrder,
  filterType,
  setFilterType,
  filterDoctor,
  setFilterDoctor,
  filterReport,
  setFilterReport,
}) => {
  let filteredFiles = [...files];

  if (searchTerm)
    filteredFiles = filteredFiles.filter((file) =>
      file.fileName.toLowerCase().includes(searchTerm.toLowerCase())
    );

  if (filterType)
    filteredFiles = filteredFiles.filter((file) => file.fileType === filterType);

  if (filterDoctor)
    filteredFiles = filteredFiles.filter((file) => file.doctorName === filterDoctor);

  if (filterReport)
    filteredFiles = filteredFiles.filter((file) => file.reportType === filterReport);

  if (sortOrder === "newest")
    filteredFiles.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  else if (sortOrder === "oldest")
    filteredFiles.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));

  return (
    <div className="file-board-container">
      <h2 className="file-board-heading">Patient Records</h2>

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

        <div style={{ display: "flex", flexWrap: "wrap", gap: "1rem", justifyContent: "center", marginTop: "1rem" }}>
          <select value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="">Sort by</option>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
          </select>

          <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
            <option value="">Filter by File Type</option>
            {[...new Set(files.map((file) => file.fileType))].map((type) => (
              <option key={type} value={type}>
                {type.split("/")[1].toUpperCase()}
              </option>
            ))}
          </select>

          <select value={filterDoctor} onChange={(e) => setFilterDoctor(e.target.value)}>
            <option value="">Filter by Doctor</option>
            {[...new Set(files.map((file) => file.doctorName))].map((doctor) => (
              <option key={doctor} value={doctor}>{doctor}</option>
            ))}
          </select>

          <select value={filterReport} onChange={(e) => setFilterReport(e.target.value)}>
            <option value="">Filter by Report Type</option>
            {[...new Set(files.map((file) => file.reportType))].map((report) => (
              <option key={report} value={report}>{report}</option>
            ))}
          </select>
        </div>
      </div>

      {filteredFiles.length === 0 ? (
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

export default FileBoard;
