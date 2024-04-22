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
          className: 'yello-highlight',
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

  const handleHighlight = () => {
    const selection = window.getSelection();
    if (!selection.isCollapsed) {
        highlighter.fromRange(selection.getRangeAt(0));
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
