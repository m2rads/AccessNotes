// import React, {useEffect} from 'react'
import styled from "styled-components";
import Draggable from "react-draggable";

const Container = styled.div`
  z-index: 1000;
  border: 1px solid grey;
  // border-radius: 10px;
  opacity: 0;
  position: absolute;
  background: white;
`;

// top: ${(props) => props.y + "px"};
//   left: ${(props) => props.x + "px"};

const Header = styled.div`
  height: 20px;
  // border-radius: 10px 10px 0 0;
  background-color: papayawhip;
`;

const CloseButton = styled.button`
  // border-radius: 0 10px 0 0;
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
  // drag the sticekynote when clicked on the header
  return (
    <div>
      {/* <Draggable handle="#handle"> */}
      <Container className="container" style={props.stickyNoteStyle}>
        <Header id="handle">
          <CloseButton>X</CloseButton>
        </Header>
        <NoteTextArea />
      </Container>
      {/* </Draggable> */}
    </div>
  );
}

export default StickyNote;
