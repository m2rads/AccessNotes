import React, { useState, useRef } from "react";
import "./StickyNote.css";

function StickyNote(props) {
  const [note, setNote] = useState("");
  const handleNoteChange = (e) => {
    e.preventDefault();
  };
  const noteContent = useRef();

  return (
    <div>
      <div className="note-container" style={props.stickyNoteStyle}>
        <div className="note-header" id="handle">
          <button className="close-butt" onClick={() => props.onCloseNote()}>
            X
          </button>
        </div>
        <textarea
          className="note-content"
          id="noteTextArea"
          ref={noteContent}
          type="text"
          onChange={handleNoteChange}
        />
      </div>
    </div>
  );
}

export default StickyNote;
