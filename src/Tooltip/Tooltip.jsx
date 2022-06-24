import React from "react";
import "./Tooltip.css";
// import { useState } from "react";

class Tootlip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      hColor: "h-y"
    };
  }

  handleSetColor = (color) => {
    this.setState((state, props) => {
      return {hColor: color };
    }, () => { this.props.onHighlight(this.state.hColor) })
  };

  render() {
    return (
      <div className="tooltip" id="tooltip" style={this.props.toolTipLocStyle}>
        <div className="heading">
          <p>Highlight</p>
          <div className="h-color">
            <button
              className="color-btn h-y"
              onClick={() => this.handleSetColor("h-y")}
            >
              {/* Yellow */}
            </button>
            <button
              className="color-btn h-g"
              onClick={() => this.handleSetColor("h-g")}
            >
              {/* Green */}
            </button>
            <button
              className="color-btn h-p"
              onClick={() => this.handleSetColor("h-p")}
            >
              {/* Pink */}
            </button>
            <button
              className="color-btn h-b"
              onClick={() => this.handleSetColor("h-b")}
            >
              {/* Blue */}
            </button>
          </div>
        </div>
  
        <div className="btn-gp">
          <button className="btn-el" onClick={() => this.props.onAddNote(this.state.hColor)}>
            Add Note
          </button>
  
          <button className="btn-el" onClick={() => this.props.onRemove()}>
            Read
          </button>
  
          <button className="btn-el" onClick={() => this.props.onRemove()}>
            Remove
          </button>
        </div>
      </div>
    );
  }
};

export default Tootlip;
