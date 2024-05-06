import styled from 'styled-components';

export const SidebarContainer = styled.div`
  margin: 0 auto;
  max-width: 500px;
  background-color: #09090b;
  padding: 20px;
  height: 100vh;
`;

export const FolderItem = styled.div`
  background-color: #18181b;
  padding: 10px 15px;
  margin: 15px 0;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

export const FolderTitle = styled.span`
  font-weight: 600;
  color: #e4e4e7;
  margin-left: 10px; 
`;

export const FileContainer = styled.div`
  margin-left: 20px;
  padding: 20px;
`;


export const FileItem = styled.div`
  display: flex;
  justify-content: flex-start;
  align-items: center;
  color: #d4d4d8;
`;


export const AnimatedIconContainer = styled.div`
  margin-right: 3px;
  transition: transform 0.5s ease;

  &.open {
    transform: rotate(1deg);
  }
`;

export const EditNoteArea = styled.textarea`
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  margin-top: 10px;
  border: 1px solid #4b5563; 
  background-color: #27272a;
  color: #e5e7eb; 
  resize: vertical; 
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #374151; 
  }

  &::-webkit-scrollbar-thumb {
    background-color: #6b7280; 
    border-radius: 10px;
    border: 2px solid #374151;
  }
`;


export const SaveButton = styled.button`
  padding: 6px 8px;
  font-size: 12px;
  background-color: #18181b; 
  color: #e5e7eb;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.3s;

  &:hover {
    background-color: #27272a; 
  }

  &:focus {
    outline: none;
    box-shadow: 0 0 0 2px #3f3f46;
  }

  &:active {
    background-color: #3f3f46; 
  }
`;

