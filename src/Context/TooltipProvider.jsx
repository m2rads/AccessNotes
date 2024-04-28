import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from 'uuid';

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

    const addStickyNote = (id) => {
        const newNote = {
          id: id,
          content: '',
        };
        setStickyNotes([...stickyNotes, newNote]);
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
            removeStickyNote
        }}>
            {children}
        </ToolTipContext.Provider>
    );
};
