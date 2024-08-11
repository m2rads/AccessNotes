import React from 'react';
import { motion } from 'framer-motion';
import PageHeader from './PageHeader';
import { PageTitle } from './PageTitle';

export const Page = ({ 
  page, 
  onBack, 
  onTitleChange,
  editNote, 
  handleNoteChange, 
  handleNoteSave, 
  handleEditMode 
}) => {
  return (
    <motion.div
      key="annotations"
      initial={{ opacity: 0, x: 100 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -100 }}
    >
      <PageHeader 
        page={page}
        onBack={onBack}
      />
      
      <PageTitle 
          url={page.url}
          page={page}
          onTitleChange={onTitleChange}
      />
      
      {page.annotations.map((item) => (
        <div className="annotations-container" key={`highlight-${item.hs.id}`}>
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