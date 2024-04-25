import React, { useState, useEffect, useContext } from 'react';
import styled from 'styled-components';
import NoteIcon from '../Icons/NoteIcon';
import BookmarkIcon from '../Icons/BookmarkIcon';
import MultiplicationIcon from '../Icons/MultiplicationIcon';
import Devider from '../Icons/Devider'
import { useToolTip } from '../Context/TooltipProvider';

const TooltipContainer = styled.div`
  display: ${props => props.$show ? 'flex' : 'none'};
  justify-content: center;
  align-items: center;
  position: absolute;
  background-color: #18181b;
  border: 1px solid #18181b;
  padding: 8px;
  border-radius: 2px;
  z-index: 1000;
  transform: ${props => props.$position === 'above' ? 'translate(-50%, calc(-100% - 12px))' : 'translate(-50%, 32px)'};
  
  &:after {
    content: '';
    position: absolute;
    top: ${props => props.$position === 'above' ? '100%' : 'auto'};
    bottom: ${props => props.$position === 'above' ? 'auto' : '100%'};
    left: 50%;
    margin-left: -10px;
    border-width: 10px;
    border-style: solid;
    border-color: ${props => props.$position === 'above' ? '#18181b transparent transparent transparent' : 'transparent transparent #18181b transparent'};
    transform: translateY(${props => props.$position === 'above' ? '-0%' : '0'});
  }
`;

const HighlightButton = styled.button`
  padding: 10px; 
  cursor: pointer;
  background-color: ${props => props.color || 'gray'};
  margin: 5px;
  border: none;
  border-radius: 2px;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0;
  cursor: pointer;
  outline: inherit;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  
  &:hover, &:focus {
    background-color: rgba(0, 0, 0, 0.1);  // Example hover and focus background
    outline: none;  // Remove focus outline or define a custom focus style
  }
`;


const Tooltip = ({ onCreateHighlight, onRemoveHighlight }) => {
  // const [showTooltip, setShowTooltip] = useState(false);
  // const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const { 
    showToolTip, 
    toggleShowToolTip, 
    tooltipPos,
    updateTooltipPos,
    location,
    updateLocation
  } = useToolTip();

  useEffect(() => {
    const handleSelectionChange = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0 && selection.toString().trim() !== '') {
        const range = selection.getRangeAt(0);
        const rect = range.getBoundingClientRect();
        if (rect.width > 0) {
          const centerX = rect.left + rect.width / 2 + window.scrollX;
          const topY = rect.top + window.scrollY;
          const tooltipHeight = 40; // Assume a fixed tooltip height or calculate dynamically

          // Check if there is enough space above for the tooltip
          if (rect.top < tooltipHeight) {
            updateLocation('below');
          } else {
            updateLocation('above');
          }

          toggleShowToolTip(true);
          updateTooltipPos({ x: centerX, y: topY });
        }
      } else {
        toggleShowToolTip(false);
      }
    };

    document.addEventListener('mouseup', handleSelectionChange);
    document.addEventListener('keyup', handleSelectionChange);

    return () => {
      document.removeEventListener('mouseup', handleSelectionChange);
      document.removeEventListener('keyup', handleSelectionChange);
    };
  }, []);

  return (
    <TooltipContainer $show={showToolTip} style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }} $position={location}>
      <HighlightButton onClick={() => onCreateHighlight('blue-highlight')} color="#93c5fd" />
      <HighlightButton onClick={() => onCreateHighlight('yellow-highlight')} color="#fde047" />
      <Devider />
      <NoteIcon />
      <BookmarkIcon />
      <Devider />
      <IconButton onClick={onRemoveHighlight} aria-label="Close">
      <MultiplicationIcon />
    </IconButton>
     </TooltipContainer>
  );
};

export default Tooltip;
