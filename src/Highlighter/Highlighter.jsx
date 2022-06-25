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
      currentNote: "Hello",
      activeHighlight: null,
    };
    this.showToolTip = this.showToolTip.bind(this);
    // this.handleAddNote = this.handleAddNote.bind(this);
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
            let highlight = this.highlighter.getHighlightForElement(e.target);
            this.setState({ currentNote: highlight.note });
            this.setState({ activeHighlight: highlight }, () => {
              console.log(this.state.activeHighlight.id);
            });
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
            let highlight = this.highlighter.getHighlightForElement(e.target);
            this.setState({ currentNote: highlight.note });
            this.setState({ activeHighlight: highlight });
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
            let highlight = this.highlighter.getHighlightForElement(e.target);
            this.setState({ currentNote: highlight.note });
            this.setState({ activeHighlight: highlight });
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
            let highlight = this.highlighter.getHighlightForElement(e.target);
            this.setState({ currentNote: highlight.note });
            this.setState({ activeHighlight: highlight });
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
          onAddNote={(noteColor) => this.handleAddNote(noteColor)}
        />
        <StickyNote
          stickyNoteStyle={this.state.stickyNoteStyle}
          onCloseNote={() => this.handleCloseNote()}
          onSave={(noteTxt) => this.saveNote(noteTxt)}
          currentNote={this.state.currentNote}
        />
      </div>
    );
  }

  // make the call to highlight state driven
  highlightSelectedText = (color) => {
    this.highlighter.highlightSelection(color);
  };

  displaySerialized = () => {
    this.setState({ isSerialized: this.highlighter.serialize() });
  };

  removeHighlightSelection = () => {
    this.highlighter.unhighlightSelection();
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
      toolTipLocStyle = {
        top: 30 + "%",
        left: 40 + "%",
        opacity: 1,
      };
    }

    this.setState({
      toolTipStyle: toolTipLocStyle,
    });
  };

  // show tooltip when clicking on the highlighted text
  activateTooltip(e) {
    if (e.target.id === "highlight") {
      this.setState({
        toolTipStyle: {
          top: 30 + "%",
          left: 40 + "%",
          opacity: 1,
        },
      });
    }
  }

  handleCloseNote = () => {
    this.setState({
      stickyNoteStyle: {
        display: "none",
        opacity: 0,
      },
    });
  };

  // bd8563a
  handleAddNote = (noteColor) => {
    this.highlighter.highlightSelection(noteColor);
    let highlightInSelection = this.highlighter.getHighlightsInSelection();

    let highlight = this.highlighter.getHighlightForElement(
      document.getElementById(
        highlightInSelection[0].classApplier.elementProperties.id
      )
    );

    if (highlightInSelection !== undefined && highlight !== null) {
      console.log(highlight.id);
      this.setState({ currentNote: "" });
      highlight.note = this.state.currentNote;
      this.setState({ activeHighlight: highlight }, () => {
        return;
      });
    }

    let toolTipLocStyle = {
      opacity: 0,
      display: "none",
    };

    this.setState({
      toolTipStyle: toolTipLocStyle,
      stickyNoteStyle: {
        top: 30 + "%",
        left: 50 + "%",
        opacity: 1,
      },
    });
  };

  saveNote = (noteTxt) => {
    console.log(noteTxt);
    this.setState({ currentNote: noteTxt });

    let highlightHolder = this.state.activeHighlight;

    highlightHolder.note = noteTxt;
    this.setState({ activeHighlight: highlightHolder }, () => {
      console.log("saveNote: " + this.state.activeHighlight.id);
    });
  };
}

export default Highlighter;
