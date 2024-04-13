import React, { useState } from "react";
import root from "react-shadow";

export const ShadowRoot = ({ children }) => {
  const [stylesNode, setStylesNode] = useState(null);

  return (
    <root.div>
      <div ref={(node) => setStylesNode(node)}>
        {stylesNode && children} {/* Render children directly */}
      </div>
    </root.div>
  );
};
