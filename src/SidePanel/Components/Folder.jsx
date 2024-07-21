// src/components/Folder/Folder.js
import React, { useState, useEffect } from 'react';
import { localStore } from '../../localStore/localStore';
import './Folder.css';
import { EmptyState } from '../EmptyState/EmptyState';
import FolderItem from './FolderItem';
import FileAnnotations from './FileAnnotations';

export function Folder() {
  const [organizedNotes, setOrganizedNotes] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [activeFile, setActiveFile] = useState(null);
  const [editNote, setEditNote] = useState({ id: null, content: '' });
  const [isThereHighlights, setIsThereHighlights] = useState(false);
  const [customTitles, setCustomTitles] = useState({});
  const [editTitle, setEditTitle] = useState({ isEditing: false, content: '' });

  const variants = {
    initial: { opacity: 0, x: 100 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -100 }
  };

  const toggleFolder = (domain) => {
    setOpenFolders(prevState => ({
      ...prevState,
      [domain]: !prevState[domain]
    }));
  };

  const handleFileClick = (path) => {
    setActiveFile(path);
  };

  const handleBack = () => {
    setActiveFile(null);
  };

  const handleTitleSave = async (domain, path) => {
    const newTitles = { ...customTitles };
    if (!newTitles[domain]) newTitles[domain] = {};
    newTitles[domain][path] = editTitle.content;
    
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
    setEditNote({ id: note.id, content: note.content });
  };

  const organizeNotes = async () => {
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
          const url = new URL(item.url);
          const domain = url.hostname;
          const path = url.pathname;

          if (!organized[domain]) {
            organized[domain] = {};
          }
          if (!organized[domain][path]) {
            organized[domain][path] = [];
          }
          organized[domain][path].push(item);

          if (customTitles && customTitles[domain] && customTitles[domain][path]) {
            organized[domain][path].forEach(note => {
              note.customTitle = customTitles[domain][path];
            });
          }
        } catch (e) {
          console.error("Error processing item", item, e);
        }
      });

      setOrganizedNotes(organized);
      setCustomTitles(customTitles);
    } catch (error) {
      console.error("Failed to organize notes and highlights", error);
    }
  };

  useEffect(() => {
    organizeNotes();
  }, []);

  useEffect(() => {
    if (typeof chrome?.runtime?.onMessage !== 'undefined') {
      const handleMessage = (message) => {
        if (message.action === 'annotationsUpdated') {
          organizeNotes();
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

  const renderFolders = () => {
    return Object.entries(organizedNotes).map(([domain, paths]) => (
      <FolderItem
        key={domain}
        domain={domain}
        paths={paths}
        isOpen={openFolders[domain]}
        onToggle={() => toggleFolder(domain)}
        onFileClick={handleFileClick}
        customTitles={customTitles}
        variants={variants}
      />
    ));
  };

  return (
    <div className="sidebar-container">
      {isThereHighlights ? (
        activeFile ? (
          <FileAnnotations
            activeFile={activeFile}
            organizedNotes={organizedNotes}
            editTitle={editTitle}
            setEditTitle={setEditTitle}
            handleTitleSave={handleTitleSave}
            editNote={editNote}
            handleNoteChange={handleNoteChange}
            handleNoteSave={handleNoteSave}
            handleEditMode={handleEditMode}
            handleBack={handleBack}
          />
        ) : (
          renderFolders()
        )
      ) : (
        <EmptyState />
      )}
    </div>
  );
}