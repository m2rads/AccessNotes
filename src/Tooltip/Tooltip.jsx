import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const TooltipContainer = styled.div`
  display: ${props => props.$show ? 'block' : 'none'};
  position: absolute;
  background-color: black;
  border: 1px solid black;
  padding: 8px;
  border-radius: 4px;
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
    border-color: ${props => props.$position === 'above' ? 'black transparent transparent transparent' : 'transparent transparent black transparent'};
    transform: translateY(${props => props.$position === 'above' ? '-0%' : '0'});
  }
`;

const Button = styled.button`
  padding: 5px 10px;
  background-color: #007bff;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;

  &:hover {
    background-color: #0056b3;
  }
`;

const Tooltip = ({ onButtonClick }) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState('above'); // Position can be 'above' or 'below'

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
            setPosition('below');
          } else {
            setPosition('above');
          }

          setShowTooltip(true);
          setTooltipPos({ x: centerX, y: topY });
        }
      } else {
        setShowTooltip(false);
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
    <TooltipContainer $show={showTooltip} style={{ left: `${tooltipPos.x}px`, top: `${tooltipPos.y}px` }} $position={position}>
      <Button onClick={onButtonClick}>Highlight</Button>
    </TooltipContainer>
  );
};

export default Tooltip;
