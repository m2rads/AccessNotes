import React from 'react';
import Sharpie from './Sharpie/Sharpie';
import { ShadowRoot } from "./ShadowRoot";
import { ToolTipProvider } from './Context/TooltipProvider';
import StickyNote from './StickyNotes/StickyNotes';

function App() {

  return (
    <ShadowRoot>
      <ToolTipProvider>
        <StickyNote />
        <Sharpie />
      </ToolTipProvider>
    </ShadowRoot>
  );
}

export default App;
