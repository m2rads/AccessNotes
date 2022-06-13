import React from "react";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-core";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "../App.css";
import Tootlip from "../Tooltip/Tooltip";

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
      rangy.createClassApplier("highlight", {
        ignoreWhiteSpace: true,
        tagNames: ["span", "a"],
        elementProperties: {
          onclick: () => {
            this.highlighter.unhighlightSelection();
          },
        },
      })
    );
    this.highlighter.addClassApplier(
      rangy.createClassApplier("note", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          //   href: "#",
          onclick: (event) => {
            this.highlight = this.highlighter.getHighlightForElement(
              event.target
            );
          },
        },
      })
    );
  }

  componentDidUpdate() {
    console.log(this.state.userAnnotation);
  }

  highlightSelectedText = () => {
    this.highlighter.highlightSelection("highlight");
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
    let selectionRange = selection.getRangeAt(0).getBoundingClientRect();
    let toolTipLocStyle = {
      opacity: 0,
      display: "none",
    };
    if (selection.toString() !== "") {
      let top = selectionRange - 80;
      let left = (selectionRange.left + selectionRange.right) / 2 - 60;
      toolTipLocStyle = {
        top: top,
        left: left,
        opacity: 1,
      };
    }

    this.setState({
      toolTipStyle: toolTipLocStyle,
    });
  };

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
}

export default Highlighter;
