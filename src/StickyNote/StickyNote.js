import React, { useEffect, useRef } from "react";
import { useAppDispatch, useAppSelector } from "../app/hooks";
import { updated } from "../features/noteTxt/noteTxt-slice";
import "./StickyNote.css";

function StickyNote(props) {
  const note = useAppSelector((state) => state.note.value);
  const dispatch = useAppDispatch();
  const noteRef = useRef(null);
  const isDragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartY = useRef(0);
  const offsetX = useRef(0);
  const offsetY = useRef(0);

  useEffect(() => {
    document.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseup", handleMouseUp);

    return () => {
      document.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseup", handleMouseUp);
    };
  }, []);

  const handleMouseDown = (e) => {
    e.preventDefault();
    isDragging.current = true;
    dragStartX.current = e.clientX;
    dragStartY.current = e.clientY;
    const { left, top } = noteRef.current.getBoundingClientRect();
    offsetX.current = dragStartX.current - left;
    offsetY.current = dragStartY.current - top;
  };

  const handleMouseMove = (e) => {
    if (isDragging.current) {
      const newLeft = e.clientX - offsetX.current;
      const newTop = e.clientY - offsetY.current;
      noteRef.current.style.left = `${newLeft}px`;
      noteRef.current.style.top = `${newTop}px`;
    }
  };

  const handleMouseUp = () => {
    isDragging.current = false;
  };

  return (
    <div className="note-container" style={props.stickyNoteStyle} ref={noteRef}>
      <div
        className="note-header"
        onMouseDown={handleMouseDown}
        style={{ cursor: "move" }}
      >
        <button className="close-butt" onClick={() => props.onCloseNote()}>
          X
        </button>
      </div>
      <textarea
        className="note-content"
        id="noteTextArea"
        value={note || ""}
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
  );
}

export default StickyNote;
