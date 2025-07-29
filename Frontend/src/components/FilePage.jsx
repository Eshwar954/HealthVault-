// FilePage.js (Using FileCard Component)
import React from 'react';
import FileCard from './FileCard';

const FilePage = ({ files }) => {
  return (
    <div className="file-page">
      {files.map((file) => (
        <FileCard key={file.id} file={file} />
      ))}
    </div>
  );
};

export default FilePage;
