import styled from 'styled-components';

export const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover, &:focus {
    outline: none;  // Remove focus outline or define a custom focus style
  }
`;