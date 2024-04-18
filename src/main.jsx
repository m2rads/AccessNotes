import React from "react";
import ReactDOM from "react-dom/client";
import { SidePanel } from "./SidePanel/SidePanel";
import "./index.css";
import App from "./App";

const insertionPoint = document.createElement("div");
insertionPoint.id = "insertion-point";
document.body.parentNode.insertBefore(insertionPoint, document.body);

const popupRoot = document.getElementById("popup-root");

// StickyNotes / content script
!popupRoot &&
  ReactDOM.createRoot(document.getElementById("insertion-point")).render(
    <React.StrictMode>
      <App />
    </React.StrictMode>
  );

// PopupComponent / popup.html
popupRoot &&
  ReactDOM.createRoot(popupRoot).render(
    <React.Fragment>
      <SidePanel />
    </React.Fragment>
  );