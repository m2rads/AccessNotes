import React, { useState, useEffect } from 'react';
import Highlighter from 'web-highlighter';
import Tooltip from '../Tooltip/Tooltip';
import './Sharpie.css'
import LocalStore from '../../localStore/localStore';
import { useToolTip } from '../Context/TooltipProvider';

const Sharpie = () => {
  const [highlighter, setHighlighter] = useState(null);
  const localStore = new LocalStore('highlights');
  const [highlightId, setHighlightId] = useState(null);

  const { 
    toggleShowToolTip, 
    tooltipPos, 
    updateTooltipPos , 
    location,
    updateLocation
    }   = useToolTip()

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
          const hId = localStore.get(id);
          updateLocation(hId.tooltipLoc);
          updateTooltipPos(hId.tooltipPos);
          toggleShowToolTip(true);
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
  }, [toggleShowToolTip, tooltipPos]);

  
  
  const handleCreateHighlight = (color) => {
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
          localStore.save(sources, color, tooltipPos, location);
        });
        highlighter.fromRange(range);
        // selection.removeAllRanges();
      }
    }
  };

  return (
    <div>
      {/* Your content that can be highlighted */}
      <Tooltip onCreateHighlight={handleCreateHighlight} />
    </div>
  );
};

export default Sharpie;
