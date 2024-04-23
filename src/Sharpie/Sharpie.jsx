import React, { useState, useEffect } from 'react';
import Highlighter from 'web-highlighter';
import Tooltip from '../Tooltip/Tooltip';
import './Sharpie.css'
import LocalStore from '../../Cache/LocalStore';

const Sharpie = () => {
  const [highlighter, setHighlighter] = useState(null);
  const localStore = new LocalStore('highlights');

  useEffect(() => {
    try {
      const newHighlighter = new Highlighter({
        exceptSelectors: ['table', 'tr', 'th'],
        style: {
          className: 'yellow-highlight'
        }
      });

      newHighlighter
        .on('selection:click', ({id}) => {
            // display different bg color when hover
            newHighlighter.remove(id)
            localStore.remove(id)
        })


      setHighlighter(newHighlighter);

      localStore.getAll().forEach(({ hs, color }) => {
        newHighlighter.setOption({ style: { className: color } });
        newHighlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id);
      });

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
        highlighter
        .on('selection:create', ({sources}) => {
          sources = sources.map(hs => ({hs}));
          // save to backend
          console.log("sources, ", sources);
          localStore.save(sources, color);
        });
        highlighter.fromRange(range);
        // selection.removeAllRanges();
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
