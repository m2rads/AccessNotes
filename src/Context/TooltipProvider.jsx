import { createContext, useContext, useState } from "react";
import LocalStore from '../../localStore/localStore';

const ToolTipContext = createContext(null);

export const useToolTip = () => useContext(ToolTipContext);

export const ToolTipProvider = ({ children }) => {
    const [showToolTip, setShowToolTip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [location, setLocation] = useState('above');
    const [stickyNotes, setStickyNotes] = useState([]);
    const localStore = new LocalStore('highlights');

    const toggleShowToolTip = (state) => {
        setShowToolTip(state);
    };

    const updateTooltipPos = (pos) => {
        setTooltipPos(pos);
    };

    const updateLocation = (loc) => {
        setLocation(loc);
    }

    const addStickyNote = (id) => {
        const existingNote = localStore.getNoteById(id);
        console.log("existingNote, ", existingNote)
    
        if (existingNote) {
            setStickyNotes(prevNotes => [...prevNotes, existingNote]);
        } else {
            const newNote = {
                id: id,
                content: '',
            };
            setStickyNotes(prevNotes => [...prevNotes, newNote]);
        }
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
            localStore
        }}>
            {children}
        </ToolTipContext.Provider>
    );
};
