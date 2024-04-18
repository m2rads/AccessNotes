import React, { useState } from 'react';
import Sharpie from './Sharpie/Sharpie';
import Tooltip from './Tooltip/Tooltip';
import { ShadowRoot } from "./ShadowRoot";

function App() {
  const [highlightText, setHighlightText] = useState(null);

  return (
    <ShadowRoot>
      {/* <Sharpie onHighlight={setHighlightText} /> */}
      <Tooltip onButtonClick={() => highlightText && highlightText()} />
    </ShadowRoot>
  );
}

export default App;
