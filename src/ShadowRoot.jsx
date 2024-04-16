import React, { useState, useEffect } from "react";
import root from "react-shadow";
import { css } from "@emotion/react";

export const ShadowRoot = ({ children }) => {
  const [stylesNode, setStylesNode] = useState(null);

  useEffect(() => {
    if (stylesNode) {
      const styleElement = document.createElement("style");
      styleElement.textContent = `
        @import "tailwindcss/base";
        @import "tailwindcss/components";
        @import "tailwindcss/utilities";
      `;
      stylesNode.appendChild(styleElement);
    }
  }, [stylesNode]);

  return (
    <root.div>
      <div ref={(node) => setStylesNode(node)}>
        {stylesNode && children}
      </div>
    </root.div>
  );
};