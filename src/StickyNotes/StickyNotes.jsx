import React from 'react';
import styled from 'styled-components';
import MultiplicationIcon from '../Icons/MultiplicationIcon';
import { IconButton } from '../StyledComponents/StyledComponents';
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
  border-radius: 4px 4px 0 0;
  background-color: #09090b;
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

function StickyNote() {

  return (
    <Draggable>

    <NoteContainer>
        <NoteHeader>
        <IconButton>
            <MultiplicationIcon color="#f4f4f5" />
        </IconButton>
        </NoteHeader>
        <NoteContent
        id="noteTextArea"
        style={{ resize: "none" }}
        />
        {/* <NoteFooter>
        </NoteFooter> */}
    </NoteContainer>
    </Draggable>
  );
}

export default StickyNote;
