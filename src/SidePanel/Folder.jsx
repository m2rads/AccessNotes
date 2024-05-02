import React, { useState, useEffect } from 'react';
import { localStore } from '../localStore/localStore';

export function Folder() {
  const [organizedNotes, setOrganizedNotes] = useState({});

  useEffect(() => {
    const organizeNotes = async () => {  // Mark function as async
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
  }, []); // Dependency array remains empty as this runs once on mount

  // Render function to display notes and highlights
  const renderFolders = () => {
    return Object.entries(organizedNotes).map(([domain, paths]) => (
      <div key={domain}>
        <h3>{domain}</h3>
        {Object.entries(paths).map(([path, items]) => (
          <div key={path}>
            <h4>{path}</h4>
            <ul>
              {items.map(item => (
                <li key={item.id}>{item.title || item.text || 'Untitled'}</li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    ));
  };

  return (
    <div className="sidebar">
      {renderFolders()}
    </div>
  );
}
