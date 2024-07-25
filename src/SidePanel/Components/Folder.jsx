import React, { useState, useEffect } from 'react';
import { localStore } from '../../localStore/localStore';
import './Folder.css'
import {
  SidebarContainer, 
  FolderTitle, 
  FolderItem, 
  AnimatedIconContainer, 
  FileItem,
  EditNoteArea,
  SaveButton,
  FileTitle,
  HighlightContentArea,
  AnnotationsContainer,
  FileHeader,
  StyledLink,
  TitleInput,
  NotePreview
} from './FolderStyledComponents';
import { FolderIcon } from '../../Icons/FolderIcon';
import { ArrowRightIcon } from '../../Icons/ArrowRightIcon';
import { ArrowLeftIcon } from '../../Icons/ArrowLeftIcon';
import { ArrowDownIcon } from '../../Icons/ArrowDownIcon';
import { FileIcon } from '../../Icons/FileIcon';
import { EmptyState } from './EmptyState';
import { ExternalLinkIcon } from '../../Icons/ExternalLinkIcon';
import { PenIcon } from '../../Icons/PenIcon';
import { motion } from 'framer-motion';

export function Folder() {
  const [organizedNotes, setOrganizedNotes] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [activeFile, setActiveFile] = useState(null);
  const [editNote, setEditNote] = useState({ id: null, content: '' });
  const [isThereHighlights, setIsThereHighlights] = useState(false);
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
    const updatedNotes = { ...organizedNotes };
    updatedNotes[domain][path].forEach(item => {
      item.title = editTitle.content;
    });

    setOrganizedNotes(updatedNotes);
    setEditTitle({ isEditing: false, content: '' });

    // Save the updated annotations to local storage
    await localStore.save(updatedNotes[domain][path], null, updatedNotes[domain][path][0].url, editTitle.content);
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
    setEditNote({ id: note.id, content: note.content})
  }

  const organizeNotes = async () => {
    try {
      const highlights = await localStore.getAll();
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
        } catch (e) {
          console.error("Error processing item", item, e);
        }
      });

      setOrganizedNotes(organized);
    } catch (error) {
      console.error("Failed to organize notes and highlights", error);
    }
  };

  useEffect(() => {
    organizeNotes();
  }, []);

  // This is for handling and rerendering the notes
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

  
  const TitleDisplayOrEdit = ({ url, domain, path, editTitle, setEditTitle, handleTitleSave }) => {
    const [hover, setHover] = useState(false);
    const currentTitle = organizedNotes[domain][path][0].title || path;
  
    const handleKeyDown = (event) => {
      if (event.key === 'Enter') {
        handleTitleSave(domain, path);
      }
    };
  
    return editTitle.isEditing ? (
      <TitleInput
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
        <StyledLink href={url} target="_blank" rel="noopener noreferrer"> 
          <h3 className='link-wrapper' style={{ marginRight: '10px' }}>{currentTitle}</h3>
        </StyledLink>
        <div
          className="edit-icon"
          onClick={() => setEditTitle({ isEditing: true, content: currentTitle })}
          style={{ visibility: hover ? 'visible' : 'hidden' }}
        >
          <PenIcon/>
        </div>
      </div>
    );
  };

  const renderFileAnnotations = () => {
    if (!activeFile) return null;

    const annotations = organizedNotes[activeFile.domain][activeFile.path];
    const fileUrl = annotations[0].url
    
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

        <FileHeader>
          <div > 
            <FileTitle>
              <TitleDisplayOrEdit 
                url={fileUrl}
                domain={activeFile.domain} 
                path={activeFile.path} 
                editTitle={editTitle} 
                setEditTitle={setEditTitle}
                handleTitleSave={handleTitleSave}
              />
            </FileTitle>
            {/* <SubTitle className='link-wrapper'>{activeFile.path}</SubTitle> */}
          </div>
        </FileHeader>

        {annotations.map((item) => (
          <AnnotationsContainer key={`highlight-${item.hs.id}`}>
            <HighlightContentArea>{item.hs.text || "Highlight without text"}</HighlightContentArea>
            {item.note && (
              <div>
                {item.note.id === editNote.id ? (
                  <div>
                    <EditNoteArea
                      value={editNote.content}
                      onChange={handleNoteChange}
                    />
                    <SaveButton onClick={handleNoteSave}>Save</SaveButton>
                  </div>
                ) : (
                  <NotePreview onClick={() => handleEditMode(item.note)}>
                    {item.note.content}
                  </NotePreview>
                )}
              </div>
            )}
          </AnnotationsContainer>
        ))}
      </motion.div>
    );
  };

  const renderFolders = () => {
    return Object.entries(organizedNotes).map(([domain, paths]) => (
      <div key={domain}>
        <FolderItem onClick={() => toggleFolder(domain)}>
          <div style={{ display: "flex", alignItems: "center" }}>
            <AnimatedIconContainer className={openFolders[domain] ? 'open' : ''}>
              {openFolders[domain] ? <ArrowDownIcon /> : <ArrowRightIcon />}
            </AnimatedIconContainer>
            <FolderIcon />
            <FolderTitle>{domain}</FolderTitle>
          </div>
          {openFolders[domain] && (
            <motion.div
              key="files"
              variants={variants}
              initial="initial"
              animate="animate"
              exit="exit"
              style={{marginLeft: "20px", padding: "20px"}}
            >
              {Object.entries(paths).map(([path, items]) => (
                <FileItem key={path} onClick={() => handleFileClick({ domain, path })}>
                  <div style={{ flexShrink: "0" }}>
                    <FileIcon />
                  </div>
                  <h3 style={{ marginLeft: "10px", overflowX: "hidden" }}>
                    {items[0].title || path}
                  </h3>
                </FileItem>
              ))}
            </motion.div>
          )}
        </FolderItem>
      </div>
    ));
  };

  return (
    <SidebarContainer className="folder-container">
        {/* {activeFile ? renderFileAnnotations() : renderFolders()} */}
        {isThereHighlights ? (activeFile ? renderFileAnnotations() : renderFolders()) : <EmptyState />}
    </SidebarContainer>
  );
}
