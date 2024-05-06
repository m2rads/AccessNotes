import React, { useState, useEffect } from 'react';
import Highlighter from 'web-highlighter';
import Tooltip from '../Tooltip/Tooltip';
import './Sharpie.css'
import { useToolTip } from '../Context/TooltipProvider';
import StickyNote from '../StickyNotes/StickyNotes';
import { localStore } from "../localStore/localStore";

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
  const reloadAnnotations = async () => {
    const url = window.location.href;

    // Remove existing highlight tips if needed
    document.querySelectorAll('.highlight-tip').forEach(tip => tip.parentNode.removeChild(tip));

    if (highlighter) {
        try {
            // Get all highlights and notes relevant to the current URL
            const [highlights, notes] = await Promise.all([
                localStore.getAll(),
                localStore.getAllNotes()
            ]);

            highlights.forEach(({ hs, color, url: storedUrl }) => {
                if (storedUrl === url) {
                    highlighter.setOption({ style: { className: color } });
                    highlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id);
                }
            });

            notes.forEach(({ id, content, url: storedUrl }) => {
                if (storedUrl === url) {
                    console.log("url: ", url);
                    console.log("content: ", content);
                    const doms = highlighter.getDoms(id);
                    if (doms && doms.length > 0) {
                        const position = getPosition(doms[0]);
                        createHighlightTip(position.top, position.left, id);
                    }
                }
            });
        } catch (error) {
            console.error('Failed to reload annotations:', error);
        }
    }
};

  // Set up polling
  useEffect(() => {
    const interval = setInterval(checkForUrlChange, 1000); // Check every second
    return () => clearInterval(interval);
  }, [currentUrl]);
  
  
  useEffect(() => {
    const setupHighlighter = async () => {
      try {
        const newHighlighter = new Highlighter({
          exceptSelectors: ['table', 'tr', 'th'],
          style: {
            className: 'yellow-highlight'
          }
        });
  
        newHighlighter.on('selection:click', async ({id}) => {
          const storedId = await localStore.get(id);
          if (storedId) {
            updateLocation(storedId.tooltipLoc);
            updateTooltipPos(storedId.tooltipPos);
            toggleShowToolTip(true);
          }
          setHighlightId(id);
        });
  
        setHighlighter(newHighlighter);
  
        const highlights = await localStore.getAll();
        highlights.forEach(({ hs, color, url }) => {
          if (url === currentUrl) {
            console.log("url: ", url);
            console.log("hs: ", hs);
            newHighlighter.setOption({ style: { className: color } });
            newHighlighter.fromStore(hs.startMeta, hs.endMeta, hs.text, hs.id);
          }
        });
  
        const notes = await localStore.getAllNotes();
        notes.forEach(({ id, content, url }) => {
          if (url === currentUrl) {
            console.log("url: ", url);
            console.log("content: ", content);
            console.log("note id: ", id);
            const doms = newHighlighter.getDoms(id);
            if (doms && doms.length > 0) {
              const position = getPosition(doms[0]);
              createHighlightTip(position.top, position.left, id);
            }
          }
        });
  
      } catch (error) {
        console.error('Error initializing Highlighter:', error);
      }
    };
  
    setupHighlighter();
  
    return () => {
      // Assuming newHighlighter is part of the component's state or ref
      if (highlighter) {
        highlighter.dispose();
      }
    };
  }, [currentUrl]); // Ensure that currentUrl is part of the dependency array if it's meant to trigger re-runs


  const handleRemoveHighlight = async () => {
    // Find and remove the corresponding delete tip
    const deleteTip = document.querySelector(`.highlight-tip[data-id="${highlightId}"]`);
    console.log("delteTip: ", highlightId)
    if (deleteTip) {
      deleteTip.parentNode.removeChild(deleteTip);
    }

    await localStore.remove(highlightId);
    await localStore.removeNoteById(highlightId);
    highlighter.remove(highlightId);

    await localStore.removeAll();
    await localStore.removeAllNotes();
    highlighter.removeAll();
    
    // Reset the highlight ID state
    setHighlightId(null);
  };

  const isOverlapping = async (newRange) => {
    const highlights = await localStore.getAll();
    return highlights.some(({ hs }) => {
      const highlightElements = highlighter.getDoms(hs.id);
      if (highlightElements.length === 0) {
        return false;
      }
  
      return highlightElements.some(element => {
        const existingRange = document.createRange();
        existingRange.selectNodeContents(element);
  
        // Check if the two ranges overlap
        const startToEnd = newRange.compareBoundaryPoints(Range.START_TO_END, existingRange) < 0;
        const endToStart = newRange.compareBoundaryPoints(Range.END_TO_START, existingRange) > 0;
  
        return !startToEnd && !endToStart; // If newRange starts before existingRange ends, and newRange ends after existingRange starts, they overlap
      });
    });
  };  
  
  const handleCreateHighlight = async (color) => {
    const selection = window.getSelection();
    if (selection.rangeCount > 0) {
      const range = selection.getRangeAt(0);
      if (!range.collapsed) {
        const overlaps = await isOverlapping(range);
        if (!overlaps) {
          highlighter.setOption({ style: { className: color } });
          highlighter.on('selection:create', ({sources}) => {
            const highlightSources = sources.map(hs => ({hs, tooltipPos, location}));
            localStore.save(highlightSources, color, tooltipPos, location, currentUrl);
          });
          highlighter.fromRange(range);
        } else {
          console.log("Selection overlaps with existing highlight.");
        }
      }
    }
  };
  

  const handleCreateStickyNote = async () => {
      // const currentUrl = window.location.href;
      const selection = window.getSelection();
      if (selection.rangeCount > 0) {
          const range = selection.getRangeAt(0);
          if (!range.collapsed) {
            const overlaps = await isOverlapping(range);
              if (!overlaps) {
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
                  const position = getPosition(highlighter.getDoms(highlightSources[0].hs.id)[0]);
                  createHighlightTip(position.top, position.left, highlightSources[0].hs.id);
                  addStickyNote(highlightSources[0].hs.id)
                  await localStore.save(highlightSources, "stickyNote", tooltipPos, location, currentUrl);
              } else {
                  console.log("note overlaps with existing note.");
              }
          } else if (highlightId) {
            // add highlight tip
            console.log(highlightId)
            const position = getPosition(highlighter.getDoms(highlightId)[0]);
            removeHighlightTip(highlightId)
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

  const removeHighlightTip = (id) => {
    const tipElement = document.querySelector(`.highlight-tip[data-id="${id}"]`);
    if (tipElement) {
        tipElement.parentNode.removeChild(tipElement);
    }
  };



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
