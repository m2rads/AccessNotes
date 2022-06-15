import React from "react";
import "./Tooltip.css";

const Tootlip = (props) => {
  return (
    <div className="tooltip" id="tooltip" style={props.toolTipLocStyle}>
      <div className="heading">
        <p>Highlight</p>
        <div className="h-color">
          <button
            className="color-btn h-y"
            onClick={() => props.onHighlight("h-y")}
          >
            {/* Yellow */}
          </button>
          <button
            className="color-btn h-g"
            onClick={() => props.onHighlight("h-g")}
          >
            {/* Green */}
          </button>
          <button
            className="color-btn h-p"
            onClick={() => props.onHighlight("h-p")}
          >
            {/* Pink */}
          </button>
          <button
            className="color-btn h-b"
            onClick={() => props.onHighlight("h-b")}
          >
            {/* Blue */}
          </button>
        </div>
      </div>

      <div className="btn-gp">
        <button className="btn-el" onClick={() => console.log("add note")}>
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
