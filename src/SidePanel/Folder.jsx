import React, { useState, useEffect } from 'react';
import { localStore } from '../localStore/localStore';
import {
  SidebarContainer, 
  FolderTitle, 
  FolderItem, 
  AnimatedIconContainer, 
  FileContainer, 
  FileItem } from './FolderStyledComponents'
import { FolderIcon } from '../Icons/FolderIcon';
import { ArrowRightIcon } from '../Icons/ArrowRightIcon';
import { ArrowDownIcon } from '../Icons/ArrowDownIcon';
import { FileIcon } from '../Icons/FileIcon';


export function Folder() {
  const [organizedNotes, setOrganizedNotes] = useState({});
  const [openFolders, setOpenFolders] = useState({});

  const toggleFolder = (domain) => {
    setOpenFolders(prevState => ({
        ...prevState,
        [domain]: !prevState[domain] 
    }));
};

  useEffect(() => {
    const organizeNotes = async () => {
      try {
        const notes = await localStore.getAllNotes(); // Now handled asynchronously
        const highlights = await localStore.getAll(); // Now handled asynchronously
        const organized = {};

        console.log("highlights: ", highlights);

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

  // Render function to display notes and highlights
  const renderFolders = () => {
    return Object.entries(organizedNotes).map(([domain, paths]) => (
        <div key={domain}>
            <FolderItem onClick={() => toggleFolder(domain)}>
                <div style={{display: "flex", alignItems: "center"}}>
                  <AnimatedIconContainer className={openFolders[domain] ? 'open' : ''}>
                      {openFolders[domain] ? <ArrowDownIcon /> : <ArrowRightIcon />}
                  </AnimatedIconContainer>
                  <FolderIcon />
                  <FolderTitle>{domain}</FolderTitle>
                </div>
                {openFolders[domain] && (
                <FileContainer>
                    {Object.entries(paths).map(([path, items]) => (
                        <FileItem key={path}>
                          <div style={{flexShrink: "0"}}> 
                            <FileIcon />
                          </div>
                          <h4 style={{marginLeft: "10px"}} >{path}</h4>
                            {/* <ul>
                                {items.map(item => (
                                    <li key={item.id}>{item.title || item.text || 'Untitled'}</li>
                                ))}
                            </ul> */}
                        </FileItem>
                      ))}
                  </FileContainer>
              )}
            </FolderItem>
            
          </div>
      ));
  };


  return (
    <SidebarContainer className="folder-container">
      {renderFolders()}
    </SidebarContainer>
  );
}
