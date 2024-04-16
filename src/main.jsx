import React from "react";
import ReactDOM from "react-dom/client";
import { SidePanel } from "./SidePanel/SidePanel";
import "./index.css";
import { ShadowRoot } from "./ShadowRoot";
import Tooltip from "./Tooltip/Tooltip";
import "tailwindcss/tailwind.css";

const insertionPoint = document.createElement("div");
insertionPoint.id = "insertion-point";
document.body.parentNode.insertBefore(insertionPoint, document.body);

const popupRoot = document.getElementById("popup-root");

// StickyNotes / content script
!popupRoot &&
  ReactDOM.createRoot(document.getElementById("insertion-point")).render(
    <React.StrictMode>
      <ShadowRoot>
        <Tooltip />
      </ShadowRoot>
    </React.StrictMode>
  );

// PopupComponent / popup.html
popupRoot &&
  ReactDOM.createRoot(popupRoot).render(
    <React.Fragment>
      <SidePanel />
    </React.Fragment>
  );