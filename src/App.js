import './App.css';
import EditorSpace from "./components/EditorSpace";
import {useState} from "react";

function App() {

    const [selectedMode, setSelectedMode] = useState()
  return (
      <EditorSpace/>

  );
}

export default App;
