import React, { useState, useEffect } from 'react';
import Highlighter from 'web-highlighter';
import Tooltip from '../Tooltip/Tooltip';
import './Sharpie.css'
import LocalStore from '../../localStore/localStore';
import { useToolTip } from '../Context/TooltipProvider';
import StickyNote from '../StickyNotes/StickyNotes';

const Sharpie = () => {
  const [highlighter, setHighlighter] = useState(null);
  const localStore = new LocalStore('highlights');
  const [highlightId, setHighlightId] = useState(null);

  const { 
    toggleShowToolTip, 
    tooltipPos, 
    updateTooltipPos , 
    location,
    updateLocation,
    stickyNotes
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
          // localStore.removeAll()
          // newHighlighter.removeAll()
          setHighlightId(id)
          const storedId = localStore.get(id);
          updateLocation(storedId.tooltipLoc);
          updateTooltipPos(storedId.tooltipPos);
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
  }, []);

  
  
  const handleCreateHighlight = (color) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
        const range = selection.getRangeAt(0);
        if (!range.collapsed) {
            // Check if the current selection overlaps with any existing highlights
            if (!isOverlapping(range)) {
                highlighter.setOption({ 
                    style: {
                        className: color
                    }
                });       
                highlighter.on('selection:create', ({sources}) => {
                    sources = sources.map(hs => ({hs, tooltipPos, location}));
                    console.log("sources, ", sources);
                    localStore.save(sources, color, tooltipPos, location);
                });
                highlighter.fromRange(range);
            } else {
                console.log("Selection overlaps with existing highlight.");
            }
        }
    }
};

const isOverlapping = (newRange) => {
  const highlights = localStore.getAll(); // Assuming this retrieves all highlights
  return highlights.some(({ hs }) => {
      const existingRange = document.createRange();
      try {
          const startNode = document.querySelector(`[data-highlight-id="${hs.id}"]`);
          const endNode = document.querySelector(`[data-highlight-id="${hs.id}"]`);

          if (startNode && endNode) {
              existingRange.setStart(startNode, 0);
              existingRange.setEnd(endNode, endNode.length);
              return existingRange.intersectsNode(newRange.commonAncestorContainer);
          }
      } catch (error) {
          console.error('Failed to set range for highlight comparison:', error);
      }
      return false;
  });
};


  const handleRemoveHighlight = () => {
    localStore.remove(highlightId);
    highlighter.remove(highlightId);
    setHighlightId(null)
  }

  return (
    <div>
      {/* Your content that can be highlighted */}
      <Tooltip onCreateHighlight={handleCreateHighlight} onRemoveHighlight={handleRemoveHighlight} />
      {stickyNotes.map(note => (
        <StickyNote
          key={note.id}
          id={note.id}
          content={note.content}
        />
      ))}
    </div>
  );
};

export default Sharpie;
