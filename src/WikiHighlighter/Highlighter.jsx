import React from "react";
import rangy from "rangy";
import "rangy/lib/rangy-classapplier";
import "rangy/lib/rangy-core";
import "rangy/lib/rangy-highlighter";
import "rangy/lib/rangy-textrange";
import "rangy/lib/rangy-serializer";
import "../App.css";

class Highlighter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSerialized: "",
      serializedHighlights: decodeURIComponent(
        window.location.search.slice(window.location.search.indexOf("=") + 1)
      ),
    };
  }

  componentDidMount() {
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
            // if (
            //   window.confirm("Delete this note (ID " + this.highlight.id + ")?")
            // ) {
            //   this.highlighter.removeHighlights([this.highlight]);
            // }
            // return false;
            // console.log(this.highlight);
            // this.highlighter.unhighlightSelection();
          },
        },
      })
    );

    if (this.state.serializedHighlights) {
      this.highlighter.deserialize(this.state.serializedHighlights);
    }
  }

  highlightSelectedText = () => {
    console.log(window.getSelection().toString());
    console.log(window.getSelection().getRangeAt(0).getClientRects());
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
        <br />
        <br />
        {/* {isSerialized !== "" && <div>{isSerialized}</div>} */}
      </div>
    );
  }
}

export default Highlighter;
