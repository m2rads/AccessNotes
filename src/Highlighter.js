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
        opacity: 0,
      },
      stickyNoteStyle: {
        opacity: 0,
      },
      noteList: {},
      activeHighlight: null,
    };
    this.showToolTip = this.showToolTip.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);

    let sr = JSON.parse(localStorage.getItem("sr"));

    console.log(sr);
    if (sr !== null) {
      this.serializedHls = sr;
    } else {
      this.serializedHls = [];
    }

    window.localStorage.clear();

    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-y", {
        ignoreWhiteSpace: true,
        elementTagName: "span",
        elementProperties: {
          id: "highlight",
          onclick: (e) => {
            // let highlight = this.highlighter.getHighlightsInSelection();
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
            // let highlight = this.highlighter.getHighlightsInSelection();
            // console.log(highlight[0]);
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
            // let highlight = this.highlighter.getHighlightsInSelection();
            // console.log(highlight[0]);
            console.log(this.state.globalHighlighter);
            this.displaySerialized();
            this.activateTooltip(e);
          },
        },
      })
    );
  }

  componentDidUpdate() {
    // window.localStorage.setItem("sr", this.serializedHighlights);
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

  storeSerializedHighlights = (hlId, hlColor, sr) => {
    let srHl = {
      id: hlId,
      sr: sr,
      color: hlColor,
      // note: "", storing the note directly in localstorage
    };
    console.log(srHl);
    this.serializedHls.push(srHl);
    window.localStorage.setItem("sr", JSON.stringify(this.serializedHls));
  };

  // make the call to highlight state driven
  highlightSelectedText = (color) => {
    let sr = rangy.serializeSelection();
    this.highlighter.highlightSelection(color);
    let highlightInSelection = this.highlighter.getHighlightsInSelection();
    this.storeSerializedHighlights(highlightInSelection[0].id, color, sr);
  };

  displaySerialized = () => {
    this.setState({ isSerialized: this.highlighter.serialize() });
    console.log(this.state.isSerialized);
  };

  removeHighlightSelection = () => {
    // let highlight = this.highlighter.getHighlightsInSelection();
    this.deleteNote(true);
    this.highlighter.unhighlightSelection();
    // if (window.confirm("Delete this highlight (ID " + highlight[0].id + ")?")) {
    // }
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
      // let currentNote = this.serializedHls[0].sr
    } else {
      // serialize the selction before dom makes any new changes for highlights
      let sr = rangy.serializeSelection();
      this.highlighter.highlightSelection(hlcolor);
      highlightInSelection = this.highlighter.getHighlightsInSelection();
      this.storeSerializedHighlights(highlightInSelection[0].id, hlcolor, sr);
    }

    // console.log(highlightInSelection);

    this.setState({ activeHighlight: highlightInSelection[0].id }, () => {
      return 0;
    });

    let currentNote = window.localStorage.getItem(highlightInSelection[0].id);
    if (currentNote !== undefined) {
      this.props.updated(currentNote);
    } else {
      window.localStorage.setItem(highlightInSelection[0].id, " ");
    }

    this.noteDisplay();
  };

  saveNote = (noteTxt) => {
    let currentHighlight = this.state.activeHighlight;
    window.localStorage.setItem(currentHighlight, noteTxt);
  };

  deleteNote = (rmHl) => {
    let currentHighlight = this.state.activeHighlight;
    if (rmHl) {
      if (
        window.confirm("Delete this highlight (ID " + currentHighlight + ")?")
      ) {
        // window.localStorage.clear();
        if (this.serializedHls !== null) {
          for (let i in this.serializedHls) {
            try {
              let highlightInSelection =
                this.highlighter.getHighlightsInSelection();
              if (this.serializedHls[i].id === highlightInSelection[0].id) {
                this.serializedHls.splice(i, 1);
                window.localStorage.setItem(
                  "sr",
                  JSON.stringify(this.serializedHls)
                );
                window.localStorage.removeItem(currentHighlight);
                this.handleCloseNote();
              }
            } catch (exp) {}
          }
        }
      }
    } else {
      if (window.confirm("Delete this note (ID " + currentHighlight + ")?")) {
        // window.localStorage.clear();
        window.localStorage.removeItem(currentHighlight);
        this.handleCloseNote();
      }
    }
  };

  highlightTextReader = () => {
    let highlightInSelection = this.highlighter.getHighlightsInSelection();

    if (highlightInSelection[0] === undefined) {
      if ("speechSynthesis" in window) {
        let textSlection = window.getSelection().toString();
        var speech = new SpeechSynthesisUtterance();
        speech.text = textSlection;
        window.speechSynthesis.speak(speech);
      } else {
        alert("Sorry, your browser doesn't support text to speech!");
      }
    } else {
      console.log("throw an error");
    }
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
