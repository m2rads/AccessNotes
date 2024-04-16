import React from "react";
import ReactDOM from "react-dom/client";
// import * as serviceWorker from "./serviceWorker";
// import Sharpie from "./Sharpie/Sharpie";
import { SidePanel } from "./SidePanel/SidePanel";
import "./index.css"
import { ShadowRoot } from "./ShadowRoot";
import Tooltip from "./Tooltip/Tooltip";

const popupRoot = document.getElementById("popup-root");

const insertionPoint = document.createElement("div");
insertionPoint.id = "insertion-point";
document.body.parentNode.insertBefore(insertionPoint, document.body);

// StickyNotes / content script
!popupRoot &&
  ReactDOM.createRoot(document.getElementById("insertion-point")).render(
    <React.StrictMode>
      <ShadowRoot>
        {/* <Sharpie /> */}
        <Tooltip />
      </ShadowRoot>
    </React.StrictMode>
  );

// PopupComponent / popup.html
popupRoot && // to suppress minified react error 200
  ReactDOM.createRoot(popupRoot).render(
    <React.Fragment>
      <SidePanel />
    </React.Fragment>
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// serviceWorker.unregister();
