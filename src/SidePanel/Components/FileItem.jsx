import { useState } from "react";
import { FileIcon } from '../../Icons/FileIcon';

const FileItem = ({ url, title, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
  
    return (
      <div 
        className={'file-item'}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={onClick}
      >
        <div className="file-icon">
          <FileIcon />
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
  