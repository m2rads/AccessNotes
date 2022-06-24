import React, { useEffect, useRef } from "react";
import styled from "styled-components";

const Container = styled.div`
  z-index: 10;
  border: 1px solid grey;
  border-radius: 10px;
  opacity: 0;
  position: fixed;
  background: white;
  box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.2), 0 6px 10px 0 rgba(0, 0, 0, 0.19);
`;

const Header = styled.div`
  height: 20px;
  border-radius: 10px 10px 0 0;
  background-color: papayawhip;
`;

const CloseButton = styled.button`
  border-radius: 0 10px 0 0;
  height: 20px;
  border: none;
  opacity: 0.5;
  float: right;
`;

// const DeleteButton = styled.button`
//   width; 20px;
//   height: 20px;
//   float: left;
// `;

const NoteTextArea = styled.textarea`
  color: black;
  height: 200px;
  width: 200px;
  border: none;
  background-color: hsla(0, 0%, 100%, 0.2);
`;

function StickyNote(props) {
  useEffect(() => {
    document.getElementById("noteTextArea").mouesup = (e) => {
      e.preventDefault();
    };
  });
  return (
    // change styled component to normal css
    <div>
      <Container className="container" style={props.stickyNoteStyle}>
        <Header id="handle">
          <CloseButton onClick={() => props.onCloseNote()}>X</CloseButton>
        </Header>
        <NoteTextArea id="noteTextArea" />
      </Container>
    </div>
  );
}

export default StickyNote;
