import React, { useState } from "react";
import root from "react-shadow";

export const ShadowRoot = ({ children }) => {
  const [stylesNode, setStylesNode] = useState(null);

  return (
    <root.div ref={setStylesNode}>
      <div>
        {stylesNode && children}
      </div>
    </root.div>
  );
};
