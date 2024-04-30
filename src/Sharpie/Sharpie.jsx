import React, { useState, useEffect } from 'react';
import Highlighter from 'web-highlighter';
import Tooltip from '../Tooltip/Tooltip';
import './Sharpie.css'
import { useToolTip } from '../Context/TooltipProvider';
import StickyNote from '../StickyNotes/StickyNotes';

const Sharpie = () => {
  const [highlighter, setHighlighter] = useState(null);
  const [highlightId, setHighlightId] = useState(null);
  const [currentUrl, setCurrentUrl] = useState(window.location.href)

  const { 
    toggleShowToolTip, 
    tooltipPos, 
    updateTooltipPos , 
    location,
    updateLocation,
    stickyNotes,
    addStickyNote,
    localStore
    }   = useToolTip()

    // Function to check URL and reload if necessary
  const checkForUrlChange = () => {
    const url = window.location.href;
    if (url !== currentUrl) {
      console.log("URL changed from", currentUrl, "to", url);
      setCurrentUrl(url);
      reloadAnnotations();
    }
  };

  // Function to reload annotations
  const reloadAnnotations = () => {
    if (highlighter) {
      const url = window.location.href;
      localStore.getAll().forEach(({ hs, color, url: storedUrl }) => {
        if (storedUrl === url) {
          highlighter.setOption({ style: { className: color } });
          highlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id);
        }
      });
    }
  };

  // Set up polling
  useEffect(() => {
    const interval = setInterval(checkForUrlChange, 1000); // Check every second
    return () => clearInterval(interval);
  }, [currentUrl]);
  
  
  useEffect(() => {
    // setCurrentUrl(window.location.href);
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
          // localStore.removeAllNotes()
          setHighlightId(id)
          const storedId = localStore.get(id);
          updateLocation(storedId.tooltipLoc);
          updateTooltipPos(storedId.tooltipPos);
          toggleShowToolTip(true);
        })

      setHighlighter(newHighlighter);

      localStore.getAll().forEach(({ hs, color, url }) => {
        if (url === currentUrl) {
          console.log("url: ", url)
          console.log("hs: ", hs)
          newHighlighter.setOption({ style: { className: color } });
          newHighlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id);
        }
    });
    
    localStore.getAllNotes().forEach(({ id, content, url }) => {
        if (url === currentUrl) {
          console.log("url: ", url)
          console.log("content: ", content)
            console.log("note id: ", id);
            const doms = newHighlighter.getDoms(id);
            if (doms && doms.length > 0) {
                const position = getPosition(doms[0]);
                createHighlightTip(position.top, position.left, id);
            }
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
    // const currentUrl = window.location.href;
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
                let highlightSources;
                highlighter.on('selection:create', ({sources}) => {
                  highlightSources = sources.map(hs => ({hs, tooltipPos, location}));
                });
                highlighter.fromRange(range);
                localStore.save(highlightSources, color, tooltipPos, location, currentUrl);
            } else {
                console.log("Selection overlaps with existing highlight.");
            }
        }
    }
};

  const handleRemoveHighlight = () => {
    // Find and remove the corresponding delete tip
    const deleteTip = document.querySelector(`.highlight-tip[data-id="${highlightId}"]`);
    console.log("delteTip: ", highlightId)
    if (deleteTip) {
      deleteTip.parentNode.removeChild(deleteTip);
    }

    localStore.remove(highlightId);
    localStore.removeNoteById(highlightId);
    highlighter.remove(highlightId);
    
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
      // const currentUrl = window.location.href;
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
                  let highlightSources;   
                  highlighter.on('selection:create', ({sources}) => {
                      highlightSources = sources.map(hs => ({hs, tooltipPos, location}));
                  });
                  highlighter.fromRange(range);
                  // highlightSources.forEach(source => {
                  //   console.log(source.hs.id)
                      
                  // });
                  const position = getPosition(highlighter.getDoms(highlightSources[0].hs.id)[0]);
                  createHighlightTip(position.top, position.left, highlightSources[0].hs.id);
                  addStickyNote(highlightSources[0].hs.id)
                  localStore.save(highlightSources, "stickyNote", tooltipPos, location, currentUrl);
              } else {
                  console.log("note overlaps with existing note.");
              }
          } else if (highlightId) {
            // add highlight tip
            console.log(highlightId)
            const position = getPosition(highlighter.getDoms(highlightId)[0]);
            createHighlightTip(position.top, position.left, highlightId);

            addStickyNote(highlightId);
          }
      }
    }

  const createHighlightTip = (top, left, id) => {
      const span = document.createElement('span');
      span.style.left = `${left - 20}px`;
      span.style.top = `${top - 25}px`;
      span.dataset.id = id;
      span.textContent = 'Note';
      span.classList.add('highlight-tip');
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
          note.id ? (
            <StickyNote
              key={note.id}
              id={note.id}
              content={note.content}
            />
          ) : null
        ))}
    </div>
  );
};

export default Sharpie;
