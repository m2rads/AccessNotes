import { createContext, useContext, useState } from "react";

const ToolTipContext = createContext(null);

export const useToolTip = () => useContext(ToolTipContext);

export const ToolTipProvider = ({ children }) => {
    const [showToolTip, setShowToolTip] = useState(false);
    const [tooltipPos, setTooltipPos] = useState({ x: 0, y: 0 });
    const [location, setLocation] = useState('above');
    const [showNote, setShowNote] = useState("false");

    const toggleShowToolTip = (state) => {
        setShowToolTip(state);
    };

    const updateTooltipPos = (pos) => {
        setTooltipPos(pos);
    };

    const updateLocation = (loc) => {
        setLocation(loc);
    }

    return (
        <ToolTipContext.Provider value={{ 
            showToolTip, 
            toggleShowToolTip, 
            tooltipPos, 
            updateTooltipPos,
            location,
            updateLocation 
        }}>
            {children}
        </ToolTipContext.Provider>
    );
};
