import React, { Component } from "react";
import rangy from "rangy/lib/rangy-serializer";
import { getSafeRanges } from "../Utility/Utility";
import "../App.css";
// import "rangy-serializer";

class Wiki extends Component {
  constructor() {
    super();

    this.state = {
      activeElement: null,
      lastSelection: {},
      toolTipLocStyle: {
        opacity: 0,
      },
      commentBoxLocStyle: {
        opacity: 0,
      },
      selectedRanges: [],
      currentText: null,
    };
  }

  componentDidMount() {}

  render() {
    return (
      <div className="wiki-medium">
        <div className="header">
          <h1>Wiki-Medium</h1>
        </div>
        <hr />
        <div className="articleContent">
          <div>
            <button onClick={(e) => this.onHighlight()}>Highlight</button>
          </div>
        </div>
      </div>
    );
  }

  onHighlight() {
    this.highlightSelection();
  }

  handleMouseUp(e) {
    if (e.target.className !== "highlight") {
      // setTimeout(this.showToolTip(), 2);
      console.log("mouse up");
    }
  }

  highlightSelection(selection, commentText) {
    const userSelectedRanges = this.state.selectedRanges;
    if (this.state.activeElement) {
      const id = this.state.activeElement.id;
      while (document.getElementById(id) != null) {
        const newNode = document.createTextNode(
          document.getElementById(id).innerText
        );
        document
          .getElementById(id)
          .parentNode.replaceChild(newNode, document.getElementById(id));
      }

      const updatedSelectedRanges = [];

      for (let range of userSelectedRanges) {
        if (range.id !== parseInt(this.state.activeElement.id, 10)) {
          console.log("updated selected ranges");
          updatedSelectedRanges.push(range);
        }
      }

      this.setState({
        toolTipLocStyle: {
          opacity: 0,
          display: "none",
        },
        selectedRanges: updatedSelectedRanges,
      });
    } else {
      let userSelection =
        selection == null ? window.getSelection().getRangeAt(0) : selection;
      let maxId = 1;

      const serializedSelection = rangy.serializeRange(userSelection, true);
      const safeRanges = getSafeRanges(userSelection);

      for (let safeRange of safeRanges) {
        this.highlightRange(safeRange, maxId);
      }

      userSelectedRanges.push({
        id: maxId,
        range: serializedSelection,
      });

      this.setState({
        selectedRanges: userSelectedRanges,
      });

      return maxId;
    }
  }
  highlightRange(range, id) {
    const newNode = document.createElement("span");
    newNode.setAttribute("class", "highlight");
    newNode.setAttribute("id", id);
    range.surroundContents(newNode);
  }
}

export default Wiki;
