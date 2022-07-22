import React from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updated } from "../features/noteTxt/noteTxt-slice";
import "./StickyNote.css";

function StickyNote(props) {
  const note = useAppSelector((state) => state.note.value);
  const dispatch = useAppDispatch();

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
          value={note}
          onChange={(e) => dispatch(updated(e.target.value))}
          type="text"
        />

        <div className="note-footer">
          <button className="save-butt" onClick={(e) => props.onSave(note)}>
            Save
          </button>
          <button className="del-butt" onClick={(e) => props.onDelete()}>
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default StickyNote;
