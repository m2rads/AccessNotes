import { createContext, useContext, useState } from "react";
import { localStore } from "../localStore/localStore";

const ToolTipContext = createContext(null);

export const useToolTip = () => useContext(ToolTipContext);

export const ToolTipProvider = ({ children }) => {
    const [showToolTip, setShowToolTip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [location, setLocation] = useState('above');
    const [stickyNotes, setStickyNotes] = useState([]);

    const toggleShowToolTip = (state) => {
        setShowToolTip(state);
    };

    const updateTooltipPos = (pos) => {
        setTooltipPos(pos);
    };

    const updateLocation = (loc) => {
        setLocation(loc);
    }

    const addStickyNote = async (id) => {
        const existingNote = await localStore.getNoteById(id);
    
        // Update the state only if the note does not already exist
        setStickyNotes(prevNotes => {
            const noteIndex = prevNotes.findIndex(note => note.id === id);
    
            // If the note does not exist in the current state, add it
            if (noteIndex === -1) {
                if (existingNote) {
                    // If found in local storage, add that
                    return [...prevNotes, existingNote];
                } else {
                    // If not found, create a new note
                    const newNote = {
                        id: id,
                        content: '', // Default content is empty
                    };
                    return [...prevNotes, newNote];
                }
            }
            // If the note already exists in the state, just return the current state
            return prevNotes;
        });
    };
    
    
    const removeStickyNote = (id) => {
        setStickyNotes(stickyNotes.filter(note => note.id !== id));
    };

    return (
        <ToolTipContext.Provider value={{ 
            showToolTip, 
            toggleShowToolTip, 
            tooltipPos, 
            updateTooltipPos,
            location,
            updateLocation,
            stickyNotes,
            addStickyNote,
            removeStickyNote,
        }}>
            {children}
        </ToolTipContext.Provider>
    );
};
