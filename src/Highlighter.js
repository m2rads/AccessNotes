/* global Chrome */
import React from "react";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-core";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "rangy/lib/rangy-selectionsaverestore";
import "./App.css";
import Tootlip from "./Tooltip/Tooltip";
import StickyNote from "./StickyNote/StickyNote";
import { clearNote, updated } from "./features/noteTxt/noteTxt-slice";
import { connect } from "react-redux";
import { localMode } from "./constants";

class Highlighter extends React.Component {
  constructor(props) {
    super(props);
    rangy.init();
    this.highlighter = rangy.createHighlighter();
    this.state = {
      toolTipStyle: {
        display: "none",
      },
      stickyNoteStyle: {
        display: "none",
      },
      noteList: {},
      activeHighlight: null,
    };
    this.showToolTip = this.showToolTip.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);

    const url = window.location.href;
    // this.getStorageLocalMode(url);

    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-y", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          id: "highlight",
          onclick: (e) => {
            let highlight = this.highlighter.getHighlightsInSelection();
            console.log(highlight[0]);
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
            let highlight = this.highlighter.getHighlightsInSelection();
            console.log(highlight[0]);
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
            let highlight = this.highlighter.getHighlightsInSelection();
            console.log(highlight);
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
            // console.log(highlight[0]);
            // this.displaySerialized();
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
          onRead={() => this.highlightTextReader()}
        />
        <StickyNote
          stickyNoteStyle={this.state.stickyNoteStyle}
          onCloseNote={() => this.handleCloseNote()}
          onSave={(noteTxt) => this.saveNote(noteTxt)}
          onDelete={() => this.deleteNote()}
        />
      </div>
    );
  }

  // make the call to highlight state driven
  highlightSelectedText = (color) => {
    this.highlighter.highlightSelection(color);
  };

  removeHighlightSelection = () => {
    this.deleteNote(true);
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
    this.props.clearNote();
  };

  noteDisplay() {
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
  }

  handleAddNote = (hlcolor) => {
    let highlightInSelection = this.highlighter.getHighlightsInSelection();

    if (highlightInSelection[0] !== undefined) {
      console.log(highlightInSelection);
      console.log(this.serializedHls);
    } else {
      this.highlighter.highlightSelection(hlcolor);
      highlightInSelection = this.highlighter.getHighlightsInSelection();
    }

    this.noteDisplay();
  };

  saveNote = (noteTxt) => {
    let currentHighlight = this.state.activeHighlight;
    window.localStorage.setItem(currentHighlight, noteTxt);
  };
}

const mapStateToProps = (state) => {
  return {
    note: state.note.value,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    updated: (noteTxt) => dispatch(updated(noteTxt)),
    clearNote: () => dispatch(clearNote()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Highlighter);
