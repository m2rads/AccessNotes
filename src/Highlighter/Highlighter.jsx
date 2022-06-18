import React from "react";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-core";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "../App.css";
import Tootlip from "../Tooltip/Tooltip";
import StickyNote from "../StickyNote/StickyNote";
import { getPositionToToolTip } from "../Utility/Utility";

class Highlighter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      toolTipStyle: {
        opacity: 0,
      },
      stickyNoteStyle: {
        opacity: 0,
      },
      currentNote: "",
    };
    this.showToolTip = this.showToolTip.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);

    rangy.init();
    this.highlighter = rangy.createHighlighter();

    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-y", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          id: "highlight",
          onclick: (e) => {
            // let highlight = this.highlighter.getHighlightForElement(e.target);
            this.activateTooltip(e);
          },
        },
      })
    );

    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-g", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          id: "highlight",
          onclick: (e) => {
            this.activateTooltip(e);
          },
        },
      })
    );

    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-p", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          id: "highlight",
          onclick: (e) => {
            this.activateTooltip(e);
          },
        },
      })
    );

    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-b", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          id: "highlight",
          onclick: (e) => {
            this.activateTooltip(e);
          },
        },
      })
    );
  }

  // cleanup event listeners to avoid memory leak on older browsers
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleMouseUp);
  }

  render() {
    return (
      <div className="App">
        <Tootlip
          toolTipLocStyle={this.state.toolTipStyle}
          onHighlight={(color) => this.highlightSelectedText(color)}
          onRemove={() => this.removeHighlightSelection()}
          onAddNote={() => this.handleAddNote()}
        />
        <StickyNote stickyNoteStyle={this.state.stickyNoteStyle} />
      </div>
    );
  }

  highlightSelectedText = (color) => {
    this.highlighter.highlightSelection(color);
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
    let toolTipLocStyle = {
      opacity: 0,
      display: "none",
    };
    if (selection.toString() !== "") {
      toolTipLocStyle = getPositionToToolTip(selection);
    }

    this.setState({
      toolTipStyle: toolTipLocStyle,
    });
  };

  showCommentBox = () => {};

  // show tooltip when clicking on the highlighted text
  activateTooltip(e) {
    if (e.target.id === "highlight") {
      this.setState({
        toolTipStyle: getPositionToToolTip(
          document.getElementById(e.target.id)
        ),
      });
    }
  }

  handleAddNote = () => {
    let selection = window.getSelection();
    // let noteLocStyle = {
    //   opacity: 0,
    //   display: "none",
    // };
    // if (selection.toString() !== "") {

    // }
    let noteLocStyle = getPositionToToolTip(selection);
    this.setState({
      stickyNoteStyle: noteLocStyle,
    });
    console.log(this.highlighter);
  };
}

export default Highlighter;
