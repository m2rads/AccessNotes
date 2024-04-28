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
    stickyNotes,
    addStickyNote
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
        if (color == "stickyNote") {
          const position = getPosition(newHighlighter.getDoms(hs.id)[0]);
          createDeleteTip(position.top, position.left, hs.id);
        }
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

const handleRemoveHighlight = () => {
  localStore.remove(highlightId);
  highlighter.remove(highlightId);
  localStore.removeAll();
  highlighter.removeAll();

  // Find and remove the corresponding delete tip
  const deleteTip = document.querySelector(`.my-remove-tip[data-id="${highlightId}"]`);
  if (deleteTip) {
      deleteTip.parentNode.removeChild(deleteTip);
  }
  // Reset the highlight ID state
  setHighlightId(null);
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


    const handleCreateStickyNote = () => {
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
              if (!isOverlapping(range)) {
                  highlighter.setOption({ 
                      style: {
                          className: "stickyNote"
                      }
                  });       
                  highlighter.on('selection:create', ({sources}) => {
                      sources.forEach(source => {
                          const position = getPosition(highlighter.getDoms(source.id)[0]);
                          createDeleteTip(position.top, position.left, source.id);
                      });
                      sources = sources.map(hs => ({hs, tooltipPos, location}));
                      console.log("sources, ", sources.id);
                      localStore.save(sources, "stickyNote", tooltipPos, location);
                      addStickyNote(sources[0].hs.id)
                  });
                  highlighter.fromRange(range);
              } else {
                  console.log("note overlaps with existing note.");
              }
          }
      }
    }

  const createDeleteTip = (top, left, id) => {
      const span = document.createElement('span');
      span.style.left = `${left - 20}px`;
      span.style.top = `${top - 25}px`;
      span.dataset.id = id;
      span.textContent = 'delete';
      span.classList.add('my-remove-tip');
      document.body.appendChild(span);
  };

  function getPosition(element) {
      let x = 0;
      let y = 0;
      while (element) {
          x += (element.offsetLeft - element.scrollLeft + element.clientLeft);
          y += (element.offsetTop - element.scrollTop + element.clientTop);
          element = element.offsetParent;
      }
      return { top: y, left: x };
  }


  return (
    <div>
      {/* Your content that can be highlighted */}
      <Tooltip 
        onCreateHighlight={handleCreateHighlight} 
        onRemoveHighlight={handleRemoveHighlight} 
        onCreateStickyNote={handleCreateStickyNote} />
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
