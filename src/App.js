import './App.css';
import EditorSpace from "./components/EditorSpace";
import {useState} from "react";

function App() {

    const [selectedMode, setSelectedMode] = useState()
  return (
      <div className="App-header">
          <div className="head-band">
            <label className="App-logo">Root Note</label>
          </div>
          <EditorSpace/>
      </div>

  );
}

export default App;
