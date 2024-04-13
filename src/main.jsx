import React from "react";
import ReactDOM from "react-dom/client";
// import * as serviceWorker from "./serviceWorker";
import StickyNotes from "./StickyNotes";
import { PopupComponent } from "./PopupComponent";
import "./App.css"

const popupRoot = document.getElementById("popup-root");

const insertionPoint = document.createElement("div");
insertionPoint.id = "insertion-point";
document.body.parentNode.insertBefore(insertionPoint, document.body);

// StickyNotes / content script
!popupRoot &&
  ReactDOM.createRoot(document.getElementById("insertion-point")).render(
    <React.StrictMode>
      <StickyNotes />
    </React.StrictMode>
  );

// PopupComponent / popup.html
popupRoot && // to suppress minified react error 200
  ReactDOM.createRoot(popupRoot).render(
    <React.Fragment>
      <PopupComponent />
    </React.Fragment>
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
