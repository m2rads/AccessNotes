import React, { useState, useEffect } from 'react';
import { localStore } from '../localStore/localStore';
import {
  SidebarContainer, 
  FolderTitle, 
  FolderItem, 
  AnimatedIconContainer, 
  FileItem 
} from './FolderStyledComponents';
import { FolderIcon } from '../Icons/FolderIcon';
import { ArrowRightIcon } from '../Icons/ArrowRightIcon';
import { ArrowLeftIcon } from '../Icons/ArrowLeftIcon';
import { ArrowDownIcon } from '../Icons/ArrowDownIcon';
import { FileIcon } from '../Icons/FileIcon';
import { motion } from 'framer-motion';

export function Folder() {
  const [organizedNotes, setOrganizedNotes] = useState({});
  const [openFolders, setOpenFolders] = useState({});
  const [activeFile, setActiveFile] = useState(null);

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

  useEffect(() => {
    const organizeNotes = async () => {
      try {
        const notes = await localStore.getAllNotes();
        const highlights = await localStore.getAll();
        const organized = {};

        [...notes, ...highlights].forEach(item => {
          try {
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

    organizeNotes();
  }, []);

  const renderFileAnnotations = () => {
    if (!activeFile) return null;

    const annotations = organizedNotes[activeFile.domain][activeFile.path];
    console.log("annotations: ", annotations);

    return (
      <motion.div
          key="annotations"
          variants={variants}
          initial="initial"
          animate="animate"
          exit="exit"
          style={{ padding: '20px', backgroundColor: '#f3f4f6', borderRadius: '8px', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}
      >
          <button onClick={handleBack} style={{ marginBottom: '20px', padding: '10px', borderRadius: '5px', backgroundColor: '#d1d5db', border: 'none', cursor: 'pointer' }}>
              Back to Folders
          </button>
          <h1 style={{ borderBottom: '2px solid #cbd5e1', paddingBottom: '10px' }}>Annotations for {activeFile.path}</h1>
          {annotations.map((item) => (
              <div key={item.hs ? `highlight-${item.hs.id}` : `note-${item.id}`} style={{ marginTop: '20px', padding: '15px', backgroundColor: 'white', borderRadius: '5px', boxShadow: '0 2px 4px rgba(0,0,0,0.05)' }}>
                  {item.hs && (
                      <>
                          <h2 style={{ color: '#4b5563' }}>{item.hs.text || "Highlight without text"}</h2>
                          {item.notes && item.notes.map(note => (
                              <p key={`note-${note.id}`} style={{ backgroundColor: '#e5e7eb', padding: '10px', borderRadius: '5px', marginTop: '10px' }}>{note.content}</p>
                          ))}
                      </>
                  )}
                  {!item.hs && (
                      <div>
                          <h2 style={{ color: '#4b5563' }}>Note:</h2>
                          <p style={{ backgroundColor: '#e5e7eb', padding: '10px', borderRadius: '5px' }}>{item.content || "Empty Note"}</p>
                      </div>
                  )}
              </div>
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
                    <h4 style={{ marginLeft: "10px" }}>{path}</h4>
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
      {/* <AnimatePresence> */}
        {activeFile ? renderFileAnnotations() : renderFolders()}
      {/* </AnimatePresence> */}
    </SidebarContainer>
  );
}
