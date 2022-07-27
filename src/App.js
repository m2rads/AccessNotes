import "./App.css";
import Highlighter from "./Highlighter/Highlighter";
import { Provider } from "react-redux";
import { store } from "./app/store";

function App() {
  return (
    <div className="App">
      <Provider store={store}>
        <Highlighter />
      </Provider>
    </div>
  );
}

export default App;
