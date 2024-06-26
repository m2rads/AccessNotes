import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import Highlighter from './Highlighter'
import { Provider } from "react-redux";
import { store } from "./app/store";

// import { PopupComponent } from "./PopupComponent";

const popupRoot = document.getElementById("popup-root");

const insertionPoint = document.createElement("div");
insertionPoint.id = "insertion-point";
document.body.parentNode.insertBefore(insertionPoint, document.body);

// StickyNotes / content script
!popupRoot &&
  ReactDOM.render(
    <React.StrictMode>
      <Provider store={store} >
        <Highlighter />
      </Provider>
    </React.StrictMode>,
    document.getElementById("insertion-point")
  );

// PopupComponent / popup.html
popupRoot && // to suppress minified react error 200
  ReactDOM.render(
    <React.Fragment>
      {/* <PopupComponent /> */}
    </React.Fragment>,
    popupRoot
  );

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();