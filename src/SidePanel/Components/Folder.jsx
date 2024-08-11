import React, { useState, useEffect, useCallback, useRef } from 'react';
import { localStore } from '../../localStore/localStore';
import { FileIcon } from '../../Icons/FileIcon';
import { EmptyState } from './EmptyState';
import { ArrowLeftIcon } from '../../Icons/ArrowLeftIcon';
import { PenIcon } from '../../Icons/PenIcon';
import { motion } from 'framer-motion';
import { PageItem } from './PageItem';
import { DndProvider, useDrop } from 'react-dnd';
import { HTML5Backend } from 'react-dnd-html5-backend';
import { Page } from './Page';

export function Folder() {
  const [pages, setPages] = useState([]);
  const [activePage, setActivePage] = useState(null);
  const [editNote, setEditNote] = useState({ id: null, content: '' });
  const [isThereHighlights, setIsThereHighlights] = useState(false);
  
  const pagesRef = useRef(pages);

  const handlePageClick = (page) => {
    setActivePage(page);
  };

  const handleBack = () => {
    setActivePage(null);
  };

  const handleTitleChange = useCallback(async (newTitle) => {
    if (activePage) {
      const updatedPages = pagesRef.current.map(page => 
        page.id === activePage.id ? { ...page, title: newTitle } : page
      );

      setPages(updatedPages);
      pagesRef.current = updatedPages;

      // Save the updated title to local storage
      const pageToUpdate = updatedPages.find(p => p.id === activePage.id);
      if (pageToUpdate) {
        await localStore.save(
          pageToUpdate.annotations,
          null,
          pageToUpdate.url,
          newTitle
        );
      }

      // Update activePage
      setActivePage(prevActivePage => ({
        ...prevActivePage,
        title: newTitle
      }));
    }
  }, [activePage]);

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
    console.log("page structure", pageStructure);

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

  const onReorder = useCallback((draggedId, targetId, position) => {
    setPages(prevPages => {
      const reorderPages = (pages, draggedId, targetId, position) => {
        const draggedIndex = pages.findIndex(p => p.id === draggedId);
        const targetIndex = pages.findIndex(p => p.id === targetId);
        
        if (draggedIndex === -1 || targetIndex === -1) {
          // If the dragged or target page is not in this level, check subpages
          return pages.map(page => {
            if (page.subpages && page.subpages.length > 0) {
              return {
                ...page,
                subpages: reorderPages(page.subpages, draggedId, targetId, position)
              };
            }
            return page;
          });
        }

        const newPages = [...pages];
        const [removed] = newPages.splice(draggedIndex, 1);
        const insertIndex = position === 'before' ? targetIndex : targetIndex + 1;
        newPages.splice(insertIndex, 0, removed);
        return newPages;
      };

      return reorderPages(prevPages, draggedId, targetId, position);
    });
  }, []);

  const handleDrop = useCallback((draggedId, targetId) => {
    console.log(`Drag operation: Dragged ${draggedId} onto ${targetId}`);
    
    setPages(prevPages => {
      const updatePages = (pages) => {
        return pages.map(page => {
          if (page.id === draggedId) {
            return { ...page, parentId: targetId };
          }
          if (page.id === targetId) {
            return { 
              ...page, 
              subpages: page.subpages ? 
                (page.subpages.includes(draggedId) ? page.subpages : [...page.subpages, draggedId]) 
                : [draggedId] 
            };
          }
          if (page.subpages && page.subpages.includes(draggedId)) {
            return { ...page, subpages: page.subpages.filter(id => id !== draggedId) };
          }
          if (page.subpages) {
            return { ...page, subpages: updatePages(page.subpages) };
          }
          return page;
        });
      };

      const updatedPages = updatePages(prevPages);
      console.log('Updated pages structure:', updatedPages);
      return updatedPages;
    });
  }, []);

  const isCircularReference = useCallback((draggedId, targetId) => {
    let currentId = targetId;
    while (currentId) {
      if (currentId === draggedId) {
        return true;
      }
      const parent = pages.find(page => page.id === currentId);
      currentId = parent ? parent.parentId : null;
    }
    return false;
  }, [pages]);

  const RootDropZone = () => {
    const [{ isOver }, drop] = useDrop(() => ({
        accept: 'PAGE',
        drop: (item, monitor) => {
            if (!monitor.didDrop()) {
                console.log(`Dropping ${item.id} to root level`);
                handleDrop(item.id, null);
            }
        },
        collect: (monitor) => ({
            isOver: !!monitor.isOver(),
        }),
    }));

  const rootPages = pages.filter(page => !page.parentId);
    return (
      <div 
        ref={drop}
        className="drop-zone"
        style={{ 
            minHeight: '100px', 
            padding: "10px",
            transition: 'border-color 0.3s'
        }}
      >
        {rootPages.map((page, index) => (
          <PageItem 
            key={page.id} 
            page={page} 
            onClick={handlePageClick}
            onDrop={handleDrop}
            onReorder={onReorder}
            isCircularReference={isCircularReference}
            subpages={pages.filter(p => p.parentId === page.id)}
            allPages={pages}
            isFirst={index === 0}
            isLast={index === rootPages.length - 1}
          />
        ))}
      </div>
    );
  };

  return (
    <DndProvider backend={HTML5Backend}>
      <div className="">
        {isThereHighlights ? (
          activePage ? 
            <Page
              page={activePage}
              onBack={handleBack}
              onTitleChange={handleTitleChange}
              editNote={editNote}
              handleNoteChange={handleNoteChange}
              handleNoteSave={handleNoteSave}
              handleEditMode={handleEditMode}
            /> : 
            <RootDropZone onReorder={onReorder} />
        ) : (
          <EmptyState />
        )}
      </div>
    </DndProvider>
  );
}