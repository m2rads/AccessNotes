import React, { useState } from "react";
import { FileIcon } from '../../Icons/FileIcon';
import { ArrowRightIcon } from '../../Icons/ArrowRightIcon';

const FileItem = ({ url, title, onClick, onDragStart, onDragOver, onDrop, hasChildren }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div
      className={'file-item'}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={onClick}
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
    >
      <div className="file-icon">
        {hasChildren && isHovered ? <ArrowRightIcon /> : <FileIcon />}
      </div>
      <div
        className={`file-item-title ${isHovered ? 'label-emphasised' : 'label'}`}
      >
        {title}
      </div>
    </div>
  );
};

export default FileItem;