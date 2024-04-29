import React, {useState} from 'react';
import styled from 'styled-components';
import MultiplicationIcon from '../Icons/MultiplicationIcon';
import { useToolTip } from '../Context/TooltipProvider';
import Draggable from 'react-draggable';

const NoteContainer = styled.div`
  z-index: 10;
  border-radius: 4px;
  opacity: 1;
  position: fixed;
  bottom: 0;
  right: 0;
  margin: 20px;
  background: #262626;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.2), 0 3px 5px 0 rgba(0, 0, 0, 0.19);
`;

const NoteHeader = styled.div`
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 30px;
  line-height: 3rem;
  border-radius: 4px 4px 0 0;
  background-color: #09090b;
  cursor: move;
`;

const NoteContent = styled.textarea`
  padding: 15px;
  color: #f4f4f5;
  height: 150px;
  width: 300px;
  border: none;
  outline: none;
  background-color: #262626;
`;

const NoteFooter = styled.div`
  height: 20px;
  border-top: 1px 4px rgba(0, 0, 0, 0.2);
  border-radius: 0 0 4px 4px;
`;

const Button = styled.button`
  padding-right: 5px;
  border: none;
  opacity: 0.5;
  background-color: #cbf6e3;
  &:hover {
    opacity: 1;
  }
`;

const SaveButton = styled(Button)`
  border-radius: 0 0 10px 0;
  height: 20px;
  float: right;
  background-color: white;
`;

const DeleteButton = styled(Button)`
  border-radius: 0 0 0 10px;
  height: 20px;
  float: left;
  background-color: white;
`;

const IconButton = styled.button`
  background: none;
  padding: 0 5px;
  cursor: pointer;
  outline: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  border: none;
  
  &:hover, &:focus {
    outline: none;  // Remove focus outline or define a custom focus style
  }
`;

function StickyNote({ id, content }) {
  const { removeStickyNote } = useToolTip();
  const [noteContent, setNoteContent] = useState(content);

  // Update the state with the new content
  const handleContentChange = (event) => {
    setNoteContent(event.target.value);
  };

  return (
    <Draggable handle=".note-header">
      <NoteContainer>
        <NoteHeader className="note-header">
          <IconButton onClick={() => removeStickyNote(id)}>
            <MultiplicationIcon color="#f4f4f5" />
          </IconButton>
        </NoteHeader>
        <NoteContent
          id="noteTextArea"
          style={{ resize: "none" }}
          value={noteContent}
          onChange={handleContentChange}
        />
      </NoteContainer>
    </Draggable>
  );
}

export default StickyNote;

