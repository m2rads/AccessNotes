import React from "react";
import axios from "axios";
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
      middleX: 100,
      middleY: 100,
      noteList: {},
      activeHighlight: null,
    };
    this.showToolTip = this.showToolTip.bind(this);
    this.handleAddNote = this.handleAddNote.bind(this);
  }

  componentDidMount() {
    document.addEventListener("mouseup", this.handleMouseUp);

    // Make an HTTP GET request using Axios to fetch the annotations from the server
    axios
      .get("http://localhost:5000/api/annotations")
      .then((response) => {
        const data = response.data;
        console.log("data", data);
        if (data !== null && Array.isArray(data)) {
          this.serializedHls = data.map((annotation) => {
            // Remove unwanted fields (_id and __v)
            delete annotation._id;
            delete annotation.__v;
            return {
              sr: annotation.serializedSelection,
              color: annotation.color,
            };
          });

          console.log("serilzied hls", this.serializedHls);

          // restore the highlights
          for (let i in this.serializedHls) {
            try {
              const serializedSelection = this.serializedHls[i].sr;
              if (typeof serializedSelection === "string") {
                rangy.deserializeSelection(serializedSelection);
                this.highlighter.highlightSelection(
                  this.serializedHls[i].color
                );
              } else {
                console.error(
                  "Invalid serialized selection format:",
                  serializedSelection
                );
              }
            } catch (exp) {
              console.error("Error restoring highlights:", exp);
            }
          }
        } else {
          this.serializedHls = [];
        }
      })
      .catch((error) => {
        console.error("Error fetching annotations:", error);
      });

    this.highlighter.addClassApplier(
      rangy.createClassApplier("h-y", {
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

  // save annotations to DB has to replace this
  // storeSerializedHighlights = (hlId, hlColor, sr) => {
  //   let srHl = {
  //     id: hlId,
  //     sr: sr,
  //     color: hlColor,
  //   };
  //   // console.log(srHl);
  //   this.serializedHls.push(srHl);
  //   window.localStorage.setItem("sr", JSON.stringify(this.serializedHls));
  // };

  // Save the annotation to the database
  storeSerializedHighlights = async (
    highlightId,
    color,
    serializedSelection
  ) => {
    try {
      await axios.post("http://localhost:5000/api/annotations", {
        highlightId,
        color,
        serializedSelection,
      });
      console.log("Annotation saved to the database");
    } catch (error) {
      console.error("Error saving annotation to the database:", error);
    }
  };

  // make the call to highlight state driven
  highlightSelectedText = (color) => {
    let selObj = rangy.getSelection();
    let sr = rangy.serializeSelection(selObj, true);
    this.highlighter.highlightSelection(color);
    let highlightInSelection = this.highlighter.getHighlightsInSelection();
    try {
      this.storeSerializedHighlights(highlightInSelection[0].id, color, sr);
    } catch (error) {
      console.error(
        "An error occurred while storing serialized highlights:",
        error
      );
    }
  };

  displaySerialized = () => {
    this.setState({ isSerialized: this.highlighter.serialize() });
  };

  removeHighlightSelection = () => {
    // let highlight = this.highlighter.getHighlightsInSelection();
    this.deleteNote(true);
    this.highlighter.unhighlightSelection();
    // if (window.confirm("Delete this highlight (ID " + highlight[0].id + ")?")) {
    // }
  };

  handleMouseUp = (e) => {
    const targetElement = e.target;
    if (
      !targetElement.classList.contains("note-header") &&
      !targetElement.classList.contains("note-content") &&
      !targetElement.classList.contains("note-footer") &&
      e.target.className !== "highlight"
    ) {
      let pos = window.getSelection().getRangeAt(0).getBoundingClientRect();
      this.setState({
        middleX: pos.left,
        middleY: pos.bottom,
      });

      setTimeout(this.showToolTip(), 9);
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
        left: this.state.middleX + "px",
        top: this.state.middleY + "px",
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
          left: this.state.middleX + "px",
          top: this.state.middleY + "px",
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
      let sr = rangy.serializeSelection();
      this.highlighter.highlightSelection(hlcolor);
      highlightInSelection = this.highlighter.getHighlightsInSelection();
      try {
        this.storeSerializedHighlights(highlightInSelection[0].id, hlcolor, sr);
      } catch (error) {
        // console.error(
        //   "An error occurred while storing serialized highlights:",
        //   error
        // );
      }
    }

    try {
      this.setState({ activeHighlight: highlightInSelection[0].id }, () => {
        return 0;
      });
    } catch (error) {
      // console.error("An error occurred while saving the state:", error);
    }

    try {
      let currentNote = window.localStorage.getItem(highlightInSelection[0].id);
      if (currentNote !== undefined) {
        this.props.updated(currentNote);
      } else {
        window.localStorage.setItem(highlightInSelection[0].id, " ");
      }
    } catch (error) {
      // console.error("An error occurred while accessing local storage:", error);
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
