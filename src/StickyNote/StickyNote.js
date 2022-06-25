import React, { useRef } from "react";
import "./StickyNote.css";

function StickyNote(props) {
  const noteContent = useRef();

  const handleSaveNote = (e) => {
    e.preventDefault();
    props.onSave(noteContent.current.value);
  };

  return (
    <div>
      <div className="note-container" style={props.stickyNoteStyle}>
        <div className="note-header">
          <button className="close-butt" onClick={() => props.onCloseNote()}>
            X
          </button>
        </div>
        <textarea
          className="note-content"
          id="noteTextArea"
          ref={noteContent}
          defaultValue={props.currentNote}
          type="text"
        />

        <div className="note-footer">
          <button className="close-butt" onClick={(e) => handleSaveNote(e)}>
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default StickyNote;
