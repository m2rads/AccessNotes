// src/components/Folder/FileAnnotations.js
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeftIcon } from '../../Icons/ArrowLeftIcon';
import { PenIcon } from '../../Icons/PenIcon';

const TitleDisplayOrEdit = ({ url, domain, path, editTitle, setEditTitle, handleTitleSave, customTitles }) => {
  const [hover, setHover] = useState(false);
  const currentTitle = customTitles[domain]?.[path] || path;

  const handleKeyDown = (event) => {
    if (event.key === 'Enter') {
      handleTitleSave(domain, path);
    }
  };

  return editTitle.isEditing ? (
    <input
      className="title-input"
      value={editTitle.content}
      onChange={(e) => setEditTitle({ ...editTitle, content: e.target.value })}
      onBlur={() => setEditTitle({ isEditing: false, content: '' })}
      onKeyDown={handleKeyDown}
      autoFocus
    />
  ) : (
    <div 
      className="title-edit-container" 
      onMouseEnter={() => setHover(true)} 
      onMouseLeave={() => setHover(false)}
      style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", cursor: 'pointer' }}
    >
      <a href={url} target="_blank" rel="noopener noreferrer" className="styled-link"> 
        <h3 className='link-wrapper' style={{ marginRight: '10px' }}>{currentTitle}</h3>
      </a>
      <div
        className="edit-icon"
        onClick={() => setEditTitle({ isEditing: true, content: currentTitle })}
        style={{ visibility: hover ? 'visible' : 'hidden' }}
      >
        <PenIcon/>
      </div>
    </div>
  );
};

const FileAnnotations = ({
  activeFile,
  organizedNotes,
  editTitle,
  setEditTitle,
  handleTitleSave,
  editNote,
  handleNoteChange,
  handleNoteSave,
  handleEditMode,
  handleBack,
  customTitles
}) => {
  const annotations = organizedNotes[activeFile.domain][activeFile.path];
  const fileUrl = annotations[0].url;

  return (
    <motion.div
      key="annotations"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <button onClick={handleBack} className="back-button">
        <ArrowLeftIcon />
        <p>Back</p>
      </button>

      <div className="file-header">
        <div>
          <div className="file-title">
            <TitleDisplayOrEdit 
              url={fileUrl}
              domain={activeFile.domain} 
              path={activeFile.path} 
              editTitle={editTitle} 
              setEditTitle={setEditTitle}
              handleTitleSave={handleTitleSave}
              customTitles={customTitles}
            />
          </div>
        </div>
      </div>

      {annotations.map((item) => (
        <div key={`highlight-${item.hs.id}`} className="annotations-container">
          <p className="highlight-content-area">{item.hs.text || "Highlight without text"}</p>
          {item.note && (
            <div>
              {item.note.id === editNote.id ? (
                <div>
                  <textarea
                    className="edit-note-area"
                    value={editNote.content}
                    onChange={handleNoteChange}
                  />
                  <button className="save-button" onClick={handleNoteSave}>Save</button>
                </div>
              ) : (
                <p className="note-preview" onClick={() => handleEditMode(item.note)}>
                  {item.note.content}
                </p>
              )}
            </div>
          )}
        </div>
      ))}
    </motion.div>
  );
};

export default FileAnnotations;