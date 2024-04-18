import React, { useState, useEffect, useCallback } from 'react';
import Highlighter from 'web-highlighter';

const Sharpie = ({ onHighlight }) => {
  const [highlighter, setHighlighter] = useState(null);
  const [lastSelectionRange, setLastSelectionRange] = useState(null);

  useEffect(() => {
    const newHighlighter = new Highlighter();
    newHighlighter.run();
    setHighlighter(newHighlighter);

    return () => newHighlighter.dispose();
  }, []);

  const highlightText = useCallback(() => {
    if (lastSelectionRange) {
      // Use the stored range to highlight text
      highlighter.fromRange(lastSelectionRange);
      // Reset the stored range after highlighting
      setLastSelectionRange(null);
    }
  }, [highlighter, lastSelectionRange]);

  // Pass the highlightText function to the parent component
  useEffect(() => {
    if (onHighlight && highlighter) {
      onHighlight(highlightText);
    }
  }, [highlightText, onHighlight, highlighter]);

  // Save the selection range when text is selected
  useEffect(() => {
    if (highlighter) {
      highlighter.on('selection:before', ({ selection }) => {
        // Store the selection range in state
        setLastSelectionRange(selection.getRangeAt(0));
      });
    }
  }, [highlighter]);

  return (
    <div>
      {/* Your content that can be highlighted */}
    </div>
  );
};

export default Sharpie;
