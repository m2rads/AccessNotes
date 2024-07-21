// src/components/Folder/FolderItem.js
import React from 'react';
import { motion } from 'framer-motion';
import { FolderIcon } from '../../Icons/FolderIcon';
import { ArrowRightIcon } from '../../Icons/ArrowRightIcon';
import { ArrowDownIcon } from '../../Icons/ArrowDownIcon';
import { FileIcon } from '../../Icons/FileIcon';

const FolderItem = ({ domain, paths, isOpen, onToggle, onFileClick, customTitles, variants }) => {
  return (
    <div className="folder-item" onClick={onToggle}>
      <div style={{ display: "flex", alignItems: "center" }}>
        <div className={`animated-icon-container ${isOpen ? 'open' : ''}`}>
          {isOpen ? <ArrowDownIcon /> : <ArrowRightIcon />}
        </div>
        <FolderIcon />
        <h2 className="folder-title">{domain}</h2>
      </div>
      {isOpen && (
        <motion.div
          key="files"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          className="file-container"
        >
          {Object.entries(paths).map(([path, items]) => (
            <div key={path} className="file-item" onClick={() => onFileClick({ domain, path })}>
              <div style={{ flexShrink: "0" }}>
                <FileIcon />
              </div>
              <h3 style={{ marginLeft: "10px", overflowX: "hidden" }}>
                {customTitles[domain]?.[path] || path}
              </h3>
            </div>
          ))}
        </motion.div>
      )}
    </div>
  );
};

export default FolderItem;