import styled from 'styled-components';

export const SidebarContainer = styled.div`
    margin: 0 auto;
    max-width: 500px;
    background-color: #f0f0f0;
    padding: 20px;
    height: 100vh;  // Full height
`;

export const FolderItem = styled.div`
    background-color: #ffffff;
    padding: 10px 15px;
    margin: 15px 0;
    border-radius: 5px;
    box-shadow: 0px 2px 5px rgba(0, 0, 0, 0.1);
    cursor: pointer;
`;

export const FolderTitle = styled.span`
  font-weight: bold;
  color: #333333;
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
  color: black;
`;


export const AnimatedIconContainer = styled.div`
  margin-right: 3px;
  transition: transform 0.5s ease;

  &.open {
    transform: rotate(1deg);
  }
`;
