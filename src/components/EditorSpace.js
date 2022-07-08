import DrawTab from "./DrawTab";
import DrawingCanvas from "./DrawingCanvas";
import {useState} from "react";


const EditorSpace = (params) => {

    const [drawColor, setDrawColor] = useState("#000000");

  return(
      <div>
          <DrawTab setSelectedColor={setDrawColor}/>
          <DrawingCanvas strokeColor={drawColor}/>
      </div>

  )
}

export default EditorSpace

