import React from 'react';

const FileCard = ({ file }) => {
  return (
    <div className="file-card">
      <img src={file.thumbnail} alt={file.name} className="file-thumbnail" />
      <div className="file-details">
        <a href={file.url} target="_blank" rel="noopener noreferrer">
          <strong>{file.name}</strong>
        </a>
        <p>{file.source}</p>
        <p>{file.date}</p>
      </div>
    </div>
  );
};

export default FileCard;