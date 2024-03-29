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
const { v4: uuidv4 } = require("uuid");

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
    const currentUrl = window.location.href;
    const encodedUrl = encodeURIComponent(currentUrl);

    // Make an HTTP GET request using Axios to fetch the annotations from the server
    axios
      .get(`http://localhost:5000/api/annotations/${encodedUrl}`)
      .then((response) => {
        const data = response.data;
        console.log(data["highlights"]);
        const highlights = data["highlights"];
        const notes = data["notes"];
        this.retrieveHighlights(highlights);
        this.retrieveNotes(notes);
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
            console.log(this.highlighter.getHighlightsInSelection());
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
            console.log(this.highlightSelectedText);
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
          onDelete={() => this.deleteNote(false)}
        />
      </div>
    );
  }

  retrieveHighlights = (highlights) => {
    if (highlights !== null && Array.isArray(highlights)) {
      this.serializedHls = highlights.map((annotation) => {
        // Remove unwanted fields (_id and __v)
        delete annotation._id;
        delete annotation.__v;
        return {
          highlightId: annotation.highlightId,
          sr: annotation.serializedSelection,
          color: annotation.color,
        };
      });
      // restore the highlights
      for (let i in this.serializedHls) {
        try {
          const serializedSelection = this.serializedHls[i].sr;
          if (typeof serializedSelection === "string") {
            rangy.deserializeSelection(serializedSelection);
            const highlight = this.highlighter.highlightSelection(
              this.serializedHls[i].color
            );
            highlight[0].id = this.serializedHls[i].highlightId;
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
  };

  retrieveNotes = (notes) => {
    if (notes !== null && Array.isArray(notes)) {
      let retrievedNotes = notes.map((annotation) => {
        // Remove unwanted fields (_id and __v)
        delete annotation._id;
        delete annotation.__v;
        return {
          highlightId: annotation.highlightId,
          url: annotation.url,
          noteText: annotation.noteText,
        };
      });
      // restore the highlights
      for (let i in retrievedNotes) {
        try {
          const highlightId = retrievedNotes[i].highlightId;
          const noteText = retrievedNotes[i].noteText;
          if (typeof highlightId === "string") {
            // cache the notes so that retreiving it won't e required everytime
            window.localStorage.setItem(highlightId, noteText);
          } else {
            console.error(
              "Invalid highlightId for the selected note:",
              highlightId
            );
          }
        } catch (exp) {
          console.error("Error restoring notes:", exp);
        }
      }
    } else {
      this.serializedHls = [];
    }
  };

  // Save the annotation to the database
  storeSerializedHighlights = async (
    highlightId,
    color,
    serializedSelection
  ) => {
    const url = window.location.href;
    try {
      await axios.post("http://localhost:5000/api/highlights", {
        url,
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
    highlightInSelection[0].id = uuidv4();
    const selectedHighlightId = highlightInSelection[0].id;
    try {
      this.storeSerializedHighlights(selectedHighlightId, color, sr);
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

  handleMouseUp = (e) => {
    const targetElement = e.target;
    if (
      !targetElement.classList.contains("note-header") &&
      !targetElement.classList.contains("note-content") &&
      !targetElement.classList.contains("note-footer") &&
      targetElement.className !== "highlight"
    ) {
      setTimeout(this.showToolTip(), 500);
    }
  };

  // show tooltip when higlighting the text
  showToolTip = () => {
    let selection = window.getSelection();

    if (selection.toString() !== "") {
      const range = selection.getRangeAt(0);
      const lastLine =
        range.getClientRects()[range.getClientRects().length - 1];
      const tooltipWidth = 200;
      const tooltipHeight = 200;
      let tooltipX = lastLine.right;
      let tooltipY = lastLine.bottom;

      // Adjust the tooltip position if it exceeds the screen boundaries
      const screenWidth =
        window.innerWidth || document.documentElement.clientWidth;
      const screenHeight =
        window.innerHeight || document.documentElement.clientHeight;

      if (tooltipX + tooltipWidth > screenWidth) {
        tooltipX = Math.max(lastLine.left - tooltipWidth, 0);
      }

      if (tooltipY + tooltipHeight > screenHeight) {
        tooltipY = Math.max(lastLine.top - tooltipHeight, 0);
      }

      const toolTipLocStyle = {
        left: tooltipX + "px",
        top: tooltipY + "px",
        opacity: 1,
      };

      this.setState({
        toolTipStyle: toolTipLocStyle,
      });
    } else {
      let toolTipLocStyle = {
        opacity: 0,
        display: "none",
      };
      this.setState({
        toolTipStyle: toolTipLocStyle,
      });
    }
  };

  // activate the tooltip when clicked on the highlighted text
  activateTooltip = (e) => {
    if (e.target.id === "highlight") {
      const rect = e.target.getBoundingClientRect();
      const highlightWidth = rect.width;
      const highlightHeight = rect.height;
      const tooltipWidth = 200;
      const tooltipHeight = 400;
      let tooltipX = rect.left + (highlightWidth - tooltipWidth) / 2;
      let tooltipY = rect.top + (highlightHeight - tooltipHeight) / 2;

      const screenWidth =
        window.innerWidth || document.documentElement.clientWidth;
      const screenHeight =
        window.innerHeight || document.documentElement.clientHeight;

      // Check if tooltip exceeds the right boundary
      if (tooltipX + tooltipWidth > screenWidth) {
        tooltipX = screenWidth - tooltipWidth;
      }

      // Check if tooltip exceeds the bottom boundary
      if (tooltipY + tooltipHeight > screenHeight) {
        tooltipY = screenHeight - tooltipHeight;
      }

      // Check if tooltip exceeds the left boundary
      if (tooltipX < 0) {
        tooltipX = 0;
      }

      // Check if tooltip exceeds the top boundary
      if (tooltipY < 0) {
        tooltipY = 0;
      }

      this.setState({
        toolTipStyle: {
          left: tooltipX + "px",
          top: tooltipY + "px",
          opacity: 1,
        },
      });
    }
  };

  handleCloseNote = () => {
    this.setState({
      stickyNoteStyle: {
        display: "none",
        opacity: 0,
      },
    });
    this.props.clearNote();

    // Re-enable the "Add Note" button
    const addButton = document.getElementById("add-note-button");
    if (addButton) {
      addButton.disabled = false;
      addButton.classList.remove("disabled");
    }
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
    console.log("highlight in selection: ", highlightInSelection);

    if (highlightInSelection[0] !== undefined) {
      console.log(highlightInSelection);
      console.log(this.serializedHls);
    } else {
      let sr = rangy.serializeSelection();
      this.highlighter.highlightSelection(hlcolor);
      highlightInSelection = this.highlighter.getHighlightsInSelection();
      highlightInSelection[0].id = uuidv4();
      const selectedHighlightId = highlightInSelection[0].id;
      try {
        this.storeSerializedHighlights(selectedHighlightId, hlcolor, sr);
      } catch (error) {
        console.error(
          "An error occurred while storing serialized highlights:",
          error
        );
      }
    }

    try {
      this.setState({
        activeHighlight: highlightInSelection[0].id,
      });
    } catch (error) {
      console.error("An error occurred while saving the state:", error);
    }

    try {
      let currentNote = window.localStorage.getItem(highlightInSelection[0].id);
      if (currentNote !== undefined) {
        this.props.updated(currentNote);
      } else {
        window.localStorage.setItem(highlightInSelection[0].id, " ");
      }
    } catch (error) {
      console.error("An error occurred while accessing local storage:", error);
    }

    this.noteDisplay();

    // Disable the "Add Note" button
    const addButton = document.getElementById("add-note-button");
    if (addButton) {
      addButton.disabled = true;
      addButton.classList.add("disabled");
    }
  };

  saveNote = async (noteText) => {
    let currentHighlightId = this.state.activeHighlight;
    window.localStorage.setItem(currentHighlightId, noteText);
    const url = window.location.href;
    const highlightId = currentHighlightId;
    try {
      await axios.post("http://localhost:5000/api/notes", {
        url,
        highlightId,
        noteText,
      });
      console.log("Notes saved to the database");
    } catch (error) {
      console.error("Error saving notes to the database:", error);
    }
  };

  removeHighlightSelection = () => {
    this.deleteNote(true);
    this.highlighter.unhighlightSelection();
  };

  deleteNote = (rmHl) => {
    const currentHighlight = this.state.activeHighlight;

    if (rmHl) {
      if (
        window.confirm("Delete this highlight (ID " + currentHighlight + ")?")
      ) {
        if (this.serializedHls !== null) {
          const highlightInSelection =
            this.highlighter.getHighlightsInSelection();
          const selectedHighlightId = highlightInSelection[0].id;
          console.log(highlightInSelection);
          axios
            .delete(
              `http://localhost:5000/api/highlights/${selectedHighlightId}`
            )
            .then((response) => {
              console.log("Highlight removed from the database");
              this.handleCloseNote();
            })
            .catch((error) => {
              console.error(
                "Error removing highlight from the database:",
                error
              );
            });
        }
      }
    } else {
      let currentHighlight = this.state.activeHighlight;
      console.log("current Highlight: ", currentHighlight);
      if (window.confirm("Delete this note (ID " + currentHighlight + ")?")) {
        axios
          .delete(`http://localhost:5000/api/notes/${currentHighlight}`)
          .then((response) => {
            console.log("note removed from the database");
            this.handleCloseNote();
          })
          .catch((error) => {
            console.error("Error removing note from the database:", error);
          });

        localStorage.removeItem(currentHighlight);
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
