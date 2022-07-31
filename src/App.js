import './App.css';
import EditorSpace from "./components/EditorSpace";
import {useEffect, useState} from "react";

function App() {

  useEffect(() => {
    document.title = "Root Note"
  })

  return (
      <EditorSpace/>

  );
}

export default App;
