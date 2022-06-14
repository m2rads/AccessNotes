import React from "react";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-core";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "../App.css";
import Tootlip from "../Tooltip/Tooltip";
<<<<<<< HEAD
import { getPositionToToolTip } from "../Utility/Utility";
=======
>>>>>>> a5fcae4d7d505d2f16cf34d3290a56b4ae8071c5

class Highlighter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolTipStyle: {
        opacity: 0,
      },
    };
    this.showToolTip = this.showToolTip.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);
    rangy.init();
    this.highlighter = rangy.createHighlighter();
    this.highlighter.addClassApplier(
<<<<<<< HEAD
      rangy.createClassApplier("h-y", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          onclick: () => {
            this.showToolTip();
=======
      rangy.createClassApplier("highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span", "a"],
        elementProperties: {
          onclick: () => {
            this.highlighter.unhighlightSelection();
>>>>>>> a5fcae4d7d505d2f16cf34d3290a56b4ae8071c5
          },
        },
      })
    );
    this.highlighter.addClassApplier(
<<<<<<< HEAD
      rangy.createClassApplier("h-g", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          onclick: () => {
            this.showToolTip();
          },
        },
      })
    );
    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-p", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          onclick: () => {
            this.showToolTip();
          },
        },
      })
    );
    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-b", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          onclick: () => {
            this.showToolTip();
=======
      rangy.createClassApplier("note", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          //   href: "#",
          onclick: (event) => {
            this.highlight = this.highlighter.getHighlightForElement(
              event.target
            );
>>>>>>> a5fcae4d7d505d2f16cf34d3290a56b4ae8071c5
          },
        },
      })
    );
  }
  // cleanup event listeners to avoid memory leak on older browsers
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

<<<<<<< HEAD
  render() {
    return (
      <div className="App">
        <p>Select any text and click "Highlight Text</p>
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <button onClick={this.highlightSelectedText}>
          Highlight Selection
        </button>
        <button onClick={this.removeHighlightSelection}>
          Serialize Selection
        </button>
        <Tootlip
          toolTipLocStyle={this.state.toolTipStyle}
          onHighlight={(color) => this.highlightSelectedText(color)}
          onRemove={() => this.removeHighlightSelection()}
        />
        <br />
        <br />
      </div>
    );
  }

  highlightSelectedText = (color) => {
    this.highlighter.highlightSelection(color);
=======
  highlightSelectedText = () => {
    this.highlighter.highlightSelection("highlight");
>>>>>>> a5fcae4d7d505d2f16cf34d3290a56b4ae8071c5
  };

  displaySerialized = () => {
    this.setState({ isSerialized: this.highlighter.serialize() });
  };

  removeHighlightSelection = () => {
    this.highlighter.unhighlightSelection();
  };

  noteSelectedText = () => {
    this.highlighter.highlightSelection("note");
  };

  handleMouseUp = (e) => {
    if (e.target.className !== "highlight") {
      setTimeout(this.showToolTip(), 2);
    }
  };

  showToolTip = () => {
    let selection = window.getSelection();
<<<<<<< HEAD
=======
    let selectionRange = selection.getRangeAt(0).getBoundingClientRect();
>>>>>>> a5fcae4d7d505d2f16cf34d3290a56b4ae8071c5
    let toolTipLocStyle = {
      opacity: 0,
      display: "none",
    };
    if (selection.toString() !== "") {
<<<<<<< HEAD
      toolTipLocStyle = getPositionToToolTip(selection);
=======
      let top = selectionRange - 80;
      let left = (selectionRange.left + selectionRange.right) / 2 - 60;
      toolTipLocStyle = {
        top: top,
        left: left,
        opacity: 1,
      };
>>>>>>> a5fcae4d7d505d2f16cf34d3290a56b4ae8071c5
    }

    this.setState({
      toolTipStyle: toolTipLocStyle,
    });
  };
<<<<<<< HEAD
=======

  render() {
    // const isSerialized = this.state.isSerialized;

    return (
      <div className="App">
        <p>Select any text and click "Highlight Text</p>
        <h1>Hello CodeSandbox</h1>
        <h2>Start editing to see some magic happen!</h2>
        <button onClick={this.highlightSelectedText}>
          Highlight Selection
        </button>
        <button onClick={this.removeHighlightSelection}>
          Serialize Selection
        </button>
        <button onClick={this.noteSelectedText}>add note</button>
        <Tootlip toolTipLocStyle={this.state.toolTipStyle} />
        <br />
        <br />
        {/* {isSerialized !== "" && <div>{isSerialized}</div>} */}
      </div>
    );
  }
>>>>>>> a5fcae4d7d505d2f16cf34d3290a56b4ae8071c5
}

export default Highlighter;
