import React from 'react';
import Sharpie from './Sharpie/Sharpie';
import { ShadowRoot } from "./ShadowRoot";
import { ToolTipProvider } from './Context/TooltipProvider';

function App() {

  return (
    <ShadowRoot>
      <ToolTipProvider>
        <Sharpie />
      </ToolTipProvider>
    </ShadowRoot>
  );
}

export default App;
