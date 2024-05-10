import styled from 'styled-components';

export const SidebarContainer = styled.div`
  margin: 0 auto;
  max-width: 500px;
  background-color: #09090b;
  padding: 24px;
  overflow-y: auto;
  overflow-x: hidden;
`;

export const FolderItem = styled.div`
  background-color: #18181b;
  padding: 10px 15px;
  margin: 15px 0;
  border-radius: 5px;
  box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
  cursor: pointer;
`;

export const FolderTitle = styled.h2`
  max-width: 100%;     
  overflow-wrap: break-word; 
  word-wrap: break-word;  
  hyphens: auto;       

  letter-spacing: 1px;
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
  width: 90%;
  margin: 10px auto;
  padding: 10px;
  border-radius: 5px;
  border: 1px solid #4b5563; 
  background-color: #27272a;
  color: #e5e7eb; 
  resize: vertical; 
  font-size: 1.25rem;
  overflow-x: disabled;
  overflow-y: auto;
  
  &::-webkit-scrollbar {
    width: 5px;
  }

  &::-webkit-scrollbar-track {
    background: #171717; 
  }

  &::-webkit-scrollbar-thumb {
    background-color: #171717; 
    border-radius: 10px;
    border: 2px solid #171717;
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

export const FileTitle = styled.h4`
  max-width: 100%;     
  overflow-wrap: break-word; 
  word-wrap: break-word;  
  hyphens: auto;    

  font-size: 14px;
  font-weight: 400;
  color: #a3a3a3;
`

export const SubTitle = styled.span`
  color: #e5e5e5;
  font-size: 20px;
  font-weight: 500;
`

export const FileHeader = styled.div`
  padding: 10px;
`

export const HighlightContentArea = styled.p`
  font-weight: 400;
  font-size: 18px;
  color: #e5e7eb;
`

export const AnnotationsContainer = styled.div`
  margin: 16px 0;
  padding: 24px;
  background-color: #171717;
  border-radius: 5px;
  box-shadow: 0 2px 4px rgba(0,0,0,0.05);
`

export const StyledLink = styled.a`
  text-decoration: none;

  &:hover .link-wrapper {
    color: #f4f4f5;
  }
`;

export const NotePreview = styled.p`
  background-color: #27272a; 
  color: #e5e7eb;
  padding: 10px; 
  border-radius: 5px;
  margin-top: 10px; 
  cursor: pointer;
  font-size: 1.25rem;
`

export const TitleInput = styled.input`
  padding: 3px;
  background-color: #09090b;
  border-radius: 4px;
  width: 100%;
  color: #d4d4d8;
  
  &:focus {
    background-color: #1a1c1e;  
    outline: none; 
    border: 1px solid #5f6368;  
  }
`;
