import React, { useState, useEffect, useCallback, useRef } from 'react';
import { localStore } from '../../localStore/localStore';
import { FileIcon } from '../../Icons/FileIcon';
import { EmptyState } from './EmptyState';
import { ArrowLeftIcon } from '../../Icons/ArrowLeftIcon';
import { PenIcon } from '../../Icons/PenIcon';
import { motion } from 'framer-motion';
import { PageItem } from './PageItem';
import { DndProvider } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';

export function Folder() {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [editNote, setEditNote] = useState({ id: null, content: '' });
  const [isThereHighlights, setIsThereHighlights] = useState(false);
  const [editTitle, setEditTitle] = useState({ isEditing: false, content: '' });
  
  const pagesRef = useRef(pages);

  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };  

  const handlePageClick = (page) => {
    setActivePage(page);
  };

  const handleBack = () => {
    setActivePage(null);
  };
  
  const handleTitleSave = useCallback(async (pageId) => {
    const updatedPages = pagesRef.current.map(page => 
      page.id === pageId ? { ...page, title: editTitle.content } : page
    );

    setPages(updatedPages);
    pagesRef.current = updatedPages;
    setEditTitle({ isEditing: false, content: '' });

    // Save the updated title to local storage
    const pageToUpdate = updatedPages.find(p => p.id === pageId);
    if (pageToUpdate) {
      await localStore.save(
        pageToUpdate.annotations,
        null,
        pageToUpdate.url,
        editTitle.content
      );
    }
  }, [editTitle]);

  const handleNoteChange = (event) => {
    setEditNote(prev => ({ ...prev, content: event.target.value }));
  };

  const handleNoteSave = useCallback(async (event) => {
    event.preventDefault();
    await localStore.saveNote(editNote.id, editNote.content);
    
    // Update the local state immediately
    const updatedPages = pagesRef.current.map(page => ({
      ...page,
      annotations: page.annotations.map(annotation => 
        annotation.note && annotation.note.id === editNote.id
          ? { ...annotation, note: { ...annotation.note, content: editNote.content } }
          : annotation
      )
    }));

    setPages(updatedPages);
    pagesRef.current = updatedPages;
    setEditNote({ id: null, content: '' });
  }, [editNote]);

  const handleEditMode = (note) => {
    setEditNote({ id: note.id, content: note.content})
  }

  const organizePages = useCallback(async () => {
    try {
      const highlights = await localStore.getAll();
      const notes = await Promise.all(highlights.map(async highlight => {
        const note = await localStore.getNoteById(highlight.hs.id);
        return { ...highlight, note };
      }));
      
      const organized = notes.reduce((acc, item) => {
        try {
          const url = new URL(item.url);
          const existingPageIndex = acc.findIndex(page => page.url === item.url);
          
          if (existingPageIndex > -1) {
            acc[existingPageIndex].annotations.push(item);
          } else {
            acc.push({
              id: url.pathname,
              url: item.url,
              title: item.title || url.pathname,
              annotations: [item],
              subpages: [],
              parentId: null
            });
          }
        } catch (e) {
          console.error("Error processing item", item, e);
        }
        return acc;
      }, []);
  
      setIsThereHighlights(organized.length > 0);
  
      setPages(organized);
      pagesRef.current = organized;
    } catch (error) {
      console.error("Failed to organize pages and highlights", error);
      setIsThereHighlights(false);
    }
  }, []);

  const updatePages = useCallback(async () => {
    const highlights = await localStore.getAll();
    const notes = await localStore.getAllNotes();
    const pageStructure = await localStore.getPageStructure();

    setPages(prevPages => {
      const updatedPages = prevPages.map(page => {
        const pageHighlights = highlights.filter(h => h.url === page.url);
        const updatedAnnotations = pageHighlights.map(highlight => {
          const note = notes.find(n => n.id === highlight.hs.id);
          return { ...highlight, note };
        });

        const pageStructureItem = pageStructure.find(p => p.id === page.id);
        return {
          ...page,
          annotations: updatedAnnotations,
          subpages: pageStructureItem ? pageStructureItem.subpages : [],
          parentId: pageStructureItem ? pageStructureItem.parentId : null,
        };
      });

      highlights.forEach(highlight => {
        if (!updatedPages.some(page => page.url === highlight.url)) {
          const url = new URL(highlight.url);
          const newPageId = url.pathname;
          const pageStructureItem = pageStructure.find(p => p.id === newPageId);
          updatedPages.push({
            id: newPageId,
            url: highlight.url,
            title: highlight.title || url.pathname,
            annotations: [{
              ...highlight,
              note: notes.find(n => n.id === highlight.hs.id)
            }],
            subpages: pageStructureItem ? pageStructureItem.subpages : [],
            parentId: pageStructureItem ? pageStructureItem.parentId : null,
          });
        }
      });

      pagesRef.current = updatedPages;
      return updatedPages;
    });
  }, []);

  useEffect(() => {
    organizePages();
  }, []);

  useEffect(() => {
    if (typeof chrome?.runtime?.onMessage !== 'undefined') {
      const handleMessage = (message) => {
        if (message.action === 'annotationsUpdated') {
          organizePages();
          updatePages();
        }
      };

      chrome.runtime.onMessage.addListener(handleMessage);

      return () => {
        if (typeof chrome?.runtime?.onMessage?.removeListener !== 'undefined') {
          chrome.runtime.onMessage.removeListener(handleMessage);
        }
      };
    } else {
      console.warn('Chrome runtime API not available.');
    }
  }, [updatePages]);

  const TitleDisplayOrEdit = ({ url, page, editTitle, setEditTitle, handleTitleSave }) => {
    const [hover, setHover] = useState(false);
  
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleTitleSave(page.id);
      }
    };
  
    return editTitle.isEditing ? (
      <input
        className="title-input"
        value={editTitle.content}
        onChange={(e) => setEditTitle({ ...editTitle, content: e.target.value })}
        onBlur={() => setEditTitle({ isEditing: false, content: '' })}
        onKeyDown={handleKeyDown}
        autoFocus
      />
    ) : (
      <div 
        className="title-edit-container" 
        onMouseEnter={() => setHover(true)} 
        onMouseLeave={() => setHover(false)}
        style={{ display: 'flex', alignItems: 'center', justifyContent: "space-between", cursor: 'pointer' }}
      >
        <a className="styled-link" href={url} target="_blank" rel="noopener noreferrer"> 
          <h3 className='link-wrapper' style={{ marginRight: '10px' }}>{page.title}</h3>
        </a>
        <div
          className="edit-icon"
          onClick={() => setEditTitle({ isEditing: true, content: page.title })}
          style={{ visibility: hover ? 'visible' : 'hidden' }}
        >
          <PenIcon/>
        </div>
      </div>
    );
  };
  
  const renderPageAnnotations = () => {
    if (!activePage) return null;
    
    const currentPage = pagesRef.current.find(page => page.id === activePage.id);
    if (!currentPage) return null;
    
    return (
      <motion.div
        key="annotations"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
        exit={{ opacity: 0, x: -100 }}
      >
        <button onClick={handleBack} style={{ backgroundColor: "#09090b", borderRadius: '4px', display: "flex", alignItems: "center", border: 'none', cursor: 'pointer' }}>
          <ArrowLeftIcon />
          <p style={{marginLeft: "5px", color: "#9ca3af"}}>Back</p>
        </button>
  
        <div className="file-header">
          <div> 
            <h4 className="file-title">
              <TitleDisplayOrEdit 
                url={currentPage.url}
                page={currentPage}
                editTitle={editTitle} 
                setEditTitle={setEditTitle}
                handleTitleSave={handleTitleSave}
              />
            </h4>
          </div>
        </div>
  
        {currentPage.annotations.map((item) => (
          <div className="annotations-container" key={`highlight-${item.hs.id}`}>
            <p className="highlight-content-area">{item.hs.text || "Highlight without text"}</p>
            {item.note && (
              <div>
                {item.note.id === editNote.id ? (
                  <div>
                    <textarea
                      className="edit-note-area"
                      value={editNote.content}
                      onChange={handleNoteChange}
                    />
                    <button className="save-button" onClick={handleNoteSave}>Save</button>
                  </div>
                ) : (
                  <p className="note-preview" onClick={() => handleEditMode(item.note)}>
                    {item.note.content}
                  </p>
                )}
              </div>
            )}
          </div>
        ))}
      </motion.div>
    );
  };

  const handleDrop = useCallback(async (draggedId, targetId) => {
    setPages(prevPages => {
      const updatedPages = prevPages.map(page => {
        if (page.id === draggedId) {
          // Update the parentId of the dragged page
          return { ...page, parentId: targetId };
        }
        if (page.id === targetId) {
          // Add the dragged page to the subpages of the target
          return { 
            ...page, 
            subpages: page.subpages.includes(draggedId) 
              ? page.subpages 
              : [...page.subpages, draggedId] 
          };
        }
        // Remove the dragged page from its previous parent's subpages
        if (page.subpages.includes(draggedId)) {
          return { ...page, subpages: page.subpages.filter(id => id !== draggedId) };
        }
        return page;
      });

      // If the page was dragged to become a top-level page
      if (!targetId) {
        const draggedPage = updatedPages.find(page => page.id === draggedId);
        if (draggedPage) {
          draggedPage.parentId = null;
        }
      }

      pagesRef.current = updatedPages;
      return updatedPages;
    });

    // Save the updated structure to local storage
    await localStore.savePageStructure(pagesRef.current);
    
    // Trigger an update to reflect changes
    updatePages();
  }, [updatePages]);

  const isCircularReference = useCallback((draggedId, targetId) => {
    let currentId = targetId;
    while (currentId) {
      if (currentId === draggedId) return true;
      const parent = pagesRef.current.find(page => page.id === currentId);
      currentId = parent ? parent.parentId : null;
    }
    return false;
  }, []);

  const renderPages = () => {
    return (
      <motion.div
        key="pages"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <DndProvider backend={HTML5Backend}>
          <div className="drop-zone">
            {pagesRef.current.filter(page => !page.parentId).map((page) => (
              <PageItem 
                key={page.id} 
                page={page} 
                onClick={handlePageClick}
                onDrop={handleDrop}
                isCircularReference={isCircularReference}
                subpages={pagesRef.current.filter(p => p.parentId === page.id)}
                allPages={pagesRef.current}
              />
            ))}
          </div>
        </DndProvider>
      </motion.div>
    );
  };

  return (
    <div className="sidebar-container folder-container">
      {isThereHighlights ? (activePage ? renderPageAnnotations() : renderPages()) : <EmptyState />}
    </div>
  );
}