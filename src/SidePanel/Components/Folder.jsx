import React, { useState, useEffect } from 'react';
import { localStore } from '../../localStore/localStore';
import { EmptyState } from './EmptyState';
import { ExternalLinkIcon } from '../../Icons/ExternalLinkIcon';
import { PenIcon } from '../../Icons/PenIcon';
import { ArrowLeftIcon } from '../../Icons/ArrowLeftIcon';
import { ArrowRightIcon } from '../../Icons/ArrowRightIcon';
import { motion } from 'framer-motion';
import FileItem from './FileItem';

export function Folder() {
  const [pages, setPages] = useState({});
  const [activePage, setActivePage] = useState(null);
  const [editNote, setEditNote] = useState({ id: null, content: '' });
  const [isThereHighlights, setIsThereHighlights] = useState(false);
  const [customTitles, setCustomTitles] = useState({});
  const [editTitle, setEditTitle] = useState({ isEditing: false, content: '' });
  const [pageStructure, setPageStructure] = useState({});

  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };  

  const handlePageClick = (url) => {
    setActivePage(url);
  };

  const handleBack = () => {
    setActivePage(null);
  };
  
  const handleTitleSave = async (url) => {
    const newTitles = { ...customTitles, [url]: editTitle.content };
    setCustomTitles(newTitles);
    setEditTitle({ isEditing: false, content: '' });
    await localStore.saveCustomTitles(newTitles);
  }; 

  const handleNoteChange = (event) => {
    setEditNote(prev => ({ ...prev, content: event.target.value }));
  };

  const handleNoteSave = async (event) => {
    await localStore.saveNote(editNote.id, editNote.content);
    setEditNote({ id: null, content: '' });
    event.preventDefault();
  };

  const handleEditMode = (note) => {
    setEditNote({ id: note.id, content: note.content })
  }

  const organizePages = async () => {
    try {
      const highlights = await localStore.getAll();
      const customTitles = await localStore.getCustomTitles();
      const notes = await Promise.all(highlights.map(async highlight => {
        const note = await localStore.getNoteById(highlight.hs.id);
        return { ...highlight, note };
      }));
      const organized = {};

      notes.forEach(item => {
        try {
          setIsThereHighlights(true);
          if (!organized[item.url]) {
            organized[item.url] = [];
          }
          organized[item.url].push(item);

          if (customTitles && customTitles[item.url]) {
            organized[item.url].forEach(note => {
              note.customTitle = customTitles[item.url];
            });
          }
        } catch (e) {
          console.error("Error processing item", item, e);
        }
      });

      setPages(organized);
      setCustomTitles(customTitles);
      
     // Initialize page structure if it doesn't exist
    const storedStructure = await localStore.getPageStructure();
    if (Object.keys(storedStructure).length === 0) {
      const initialStructure = Object.keys(organized).reduce((acc, url) => {
        acc[url] = { parent: null, children: [] };
        return acc;
      }, {});
      setPageStructure(initialStructure);
      await localStore.savePageStructure(initialStructure);
    } else {
        setPageStructure(storedStructure);
      }
    } catch (error) {
      console.error("Failed to organize pages and highlights", error);
    }
  };

  useEffect(() => {
    organizePages();
  }, []);

  useEffect(() => {
    if (typeof chrome?.runtime?.onMessage !== 'undefined') {
      const handleMessage = (message) => {
        if (message.action === 'annotationsUpdated') {
          organizePages();
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
  }, []);

  const handleDragStart = (e, url) => {
    e.dataTransfer.setData('text/plain', url);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = async (e, targetUrl) => {
    e.preventDefault();
    const draggedUrl = e.dataTransfer.getData('text');
    
    if (draggedUrl !== targetUrl) {
      const newStructure = { ...pageStructure };
      
      // Remove from old parent
      if (newStructure[draggedUrl].parent) {
        const oldParentChildren = newStructure[newStructure[draggedUrl].parent].children;
        newStructure[newStructure[draggedUrl].parent].children = oldParentChildren.filter(url => url !== draggedUrl);
      }
      
      // Add to new parent
      newStructure[draggedUrl].parent = targetUrl;
      if (!newStructure[targetUrl].children.includes(draggedUrl)) {
        newStructure[targetUrl].children.push(draggedUrl);
      }
      
      setPageStructure(newStructure);
      await localStore.savePageStructure(newStructure);
    }
  };

  const renderPageHierarchy = (url, level = 0) => {
    const page = pageStructure[url];
    if (!page) return null;

    return (
      <div key={url} style={{ marginLeft: `${level * 20}px` }}>
        <FileItem
          url={url}
          title={customTitles[url] || new URL(url).pathname}
          onClick={() => handlePageClick(url)}
          onDragStart={(e) => handleDragStart(e, url)}
          onDragOver={handleDragOver}
          onDrop={(e) => handleDrop(e, url)}
          hasChildren={page.children.length > 0}
        />
        {page.children.map(childUrl => renderPageHierarchy(childUrl, level + 1))}
      </div>
    );
  };

  const renderPages = () => {
    return Object.keys(pageStructure)
      .filter(url => !pageStructure[url].parent)
      .map(url => renderPageHierarchy(url));
  };

  const TitleDisplayOrEdit = ({ url, editTitle, setEditTitle, handleTitleSave }) => {
    const [hover, setHover] = useState(false);
    const currentTitle = customTitles[url] || new URL(url).pathname;
  
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleTitleSave(url);
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
      <div className="title-edit-container">
        <a className="styled-link" href={url} target="_blank" rel="noopener noreferrer"> 
          <h3 className="link-wrapper" style={{ marginRight: '10px' }}>{currentTitle}</h3>
        </a>
        <div
          className="edit-icon"
          onClick={() => setEditTitle({ isEditing: true, content: currentTitle })}
        >
          <PenIcon/>
        </div>
      </div>
    );
  };  

  const renderPageAnnotations = () => {
    if (!activePage) return null;

    const annotations = pages[activePage];
    
    return (
      <motion.div
        key="annotations"
        variants={variants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <button className="back-button" onClick={handleBack}>
          <ArrowLeftIcon />
          <p>Back</p>
        </button>

        <div className="file-header">
          <div> 
            <div className="file-title">
              <TitleDisplayOrEdit 
                url={activePage}
                editTitle={editTitle} 
                setEditTitle={setEditTitle}
                handleTitleSave={handleTitleSave}
              />
            </div>
          </div>
        </div>

        {annotations.map((item) => (
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

  return (
    <div className="sidebar-container folder-container">
      {isThereHighlights ? (activePage ? renderPageAnnotations() : renderPages()) : <EmptyState />}
    </div>
  );
}