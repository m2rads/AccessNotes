import React from "react";
import "./Tooltip.css";
import { useState } from "react";

const Tootlip = (props) => {
  const [hColor, setHColor] = useState("h-y");

  const handleSetColor = (color) => {
    setHColor(color)
    props.onHighlight(hColor);
  };

  return (
    <div className="tooltip" id="tooltip" style={props.toolTipLocStyle}>
      <div className="heading">
        <p>Highlight</p>
        <div className="h-color">
          <button
            className="color-btn h-y"
            onClick={() => handleSetColor("h-y")}
          >
            {/* Yellow */}
          </button>
          <button
            className="color-btn h-g"
            onClick={() => handleSetColor("h-g")}
          >
            {/* Green */}
          </button>
          <button
            className="color-btn h-p"
            onClick={() => handleSetColor("h-p")}
          >
            {/* Pink */}
          </button>
          <button
            className="color-btn h-b"
            onClick={() => handleSetColor("h-b")}
          >
            {/* Blue */}
          </button>
        </div>
      </div>

      <div className="btn-gp">
        <button className="btn-el" >
          Add Note
        </button>

        <button className="btn-el" onClick={() => props.onRemove()}>
          Read
        </button>

        <button className="btn-el" onClick={() => props.onRemove()}>
          Remove
        </button>
      </div>
    </div>
  );
};

export default Tootlip;
