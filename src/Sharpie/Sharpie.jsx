import React, { useState, useEffect } from 'react';
import Highlighter from 'web-highlighter';
import Tooltip from '../Tooltip/Tooltip';
import './Sharpie.css'

const Sharpie = () => {
  const [highlighter, setHighlighter] = useState(null);

  useEffect(() => {
    try {
      const newHighlighter = new Highlighter({
        exceptSelectors: ['table', 'tr', 'th'],
        style: {
          className: 'yellow-highlight'
        }
      });
      setHighlighter(newHighlighter);

      return () => {
        newHighlighter.dispose();
      };
    } catch (error) {
      console.error('Error initializing Highlighter:', error);
    }
  }, []);
  
  const handleHighlight = (color) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        highlighter.setOption({ 
          style: {
            className: color
          }
        });
        highlighter.fromRange(range);
        selection.removeAllRanges();
      }
    }
  };

  return (
    <div>
      {/* Your content that can be highlighted */}
      <Tooltip onButtonClick={handleHighlight} />
    </div>
  );
};

export default Sharpie;
