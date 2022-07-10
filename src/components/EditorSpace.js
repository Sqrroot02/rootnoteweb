import DrawTab from "./DrawTab";
import DrawingCanvas from "./DrawingCanvas";
import {useState} from "react";
import DrawTypes from "./enums/DrawTypes";
import "./EditorSpace.css"


const EditorSpace = (params) => {

    // All Drawing settings saved here:
    const [drawColor, setDrawColor] = useState("#000000");
    const [drawType, setDrawType] = useState(DrawTypes.Free);

  return(
      <div>
          <div className="App-header">
              <header className="head-band">
                  <label className="App-logo">Root Note</label>
                  <DrawTab setSelectedColor={setDrawColor} setDrawType={setDrawType}/>
              </header>
              <DrawingCanvas strokeColor={drawColor} drawType={drawType}/>
          </div>


      </div>

  )
}

export default EditorSpace

