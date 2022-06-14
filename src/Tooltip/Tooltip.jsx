import React from "react";
import "./Tooltip.css";

const Tootlip = (props) => {
  return (
    <div className="tooltip" style={props.toolTipLocStyle}>
      <div className="h-color">
        <button
          className="color-b h-y"
          onClick={() => props.onHighlight("h-y")}
        >
          {/* Yellow */}
        </button>
        <button
          className="color-b h-g"
          onClick={() => props.onHighlight("h-g")}
        >
          {/* Green */}
        </button>
        <button
          className="color-b h-p"
          onClick={() => props.onHighlight("h-p")}
        >
          {/* Pink */}
        </button>
        <button
          className="color-b h-b"
          onClick={() => props.onHighlight("h-b")}
        >
          {/* Blue */}
        </button>
      </div>
      <div>
        <button onClick={() => console.log("add note")}>Add Note</button>
      </div>
      <div>
        <button onClick={() => props.onRemove()}>Read</button>
      </div>
      <div>
        <button onClick={() => props.onRemove()}>Remove</button>
      </div>
    </div>
  );
};

export default Tootlip;
