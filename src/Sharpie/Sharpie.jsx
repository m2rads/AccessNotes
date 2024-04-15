import React, { useState, useEffect } from 'react';
import Highlighter from 'web-highlighter';

const Sharpie = () => {
  const [highlighter, setHighlighter] = useState(null);
  const [highlightedSources, setHighlightedSources] = useState([]);

  useEffect(() => {
    try {
      const newHighlighter = new Highlighter();
      newHighlighter.run();
      setHighlighter(newHighlighter);
  
      return () => {
        newHighlighter.dispose();
      };
    } catch (error) {
      console.error('Error initializing Highlighter:', error);
      // Handle the error, e.g., display a fallback UI or log the error
    }
  }, []);

  useEffect(() => {
    if (highlighter) {
      highlighter.on('selection:create', ({ sources }) => {
        const newSources = sources.map((hs) => ({ hs }));
        setHighlightedSources(newSources);

        // Save highlighted sources to backend
        saveHighlightedSources(newSources);
      });

      // Retrieve and display previously highlighted sources
      const savedSources = getSavedHighlightedSources();
      savedSources.forEach(({ hs }) => {
        highlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id);
      });
    }
  }, [highlighter]);

  const saveHighlightedSources = (sources) => {
    // Implement your own logic to save highlighted sources to the backend
    console.log('Saving highlighted sources:', sources);
  };

  const getSavedHighlightedSources = () => {
    // Implement your own logic to retrieve previously saved highlighted sources
    return highlightedSources;
  };

  return (
    <div>
      {/* Your content that can be highlighted */}
    </div>
  );
};

export default Sharpie;