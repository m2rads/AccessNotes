import React from "react";
import "./Tooltip.css";

const Tootlip = (props) => {
  return (
    <div className="tooltip" style={props.toolTipLocStyle}>
      <div className="h-color">
        <button
          className="color-b h-y"
          onClick={() => props.onHighlight("fdd835")}
        >
          {/* Yellow */}
        </button>
        <button
          className="color-b h-g"
          onClick={() => props.onHighlight("a5d6a7")}
        >
          {/* Green */}
        </button>
        <button
          className="color-b h-p"
          onClick={() => props.onHighlight("f48fb1")}
        >
          {/* Pink */}
        </button>
        <button
          className="color-b h-b"
          onClick={() => props.onHighlight("64b5f6")}
        >
          {/* Blue */}
        </button>
      </div>
      {/* <button onClick={() => props.onHighlight()}>Highlight</button>
      <button onClick={() => props.onRemove()}>Remove</button> */}
    </div>
  );
};

export default Tootlip;
