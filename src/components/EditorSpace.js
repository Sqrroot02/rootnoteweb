import DrawTab from "./DrawTab";
import DrawingCanvas from "./DrawingCanvas";
import {useState} from "react";
import DrawTypes from "./enums/DrawTypes";
import "./EditorSpace.css"
import {rgbToHex} from "./helpers/NumberConversion";
import {TabTypes} from "./enums/TabTypes";
import TabSelector from "./TabSelector";


const EditorSpace = (params) => {

    // All Drawing settings saved here:
    const [drawColor, setDrawColor] = useState(rgbToHex(255,255,255));
    const [drawType, setDrawType] = useState(DrawTypes.Free);
    const [drawSize, setDrawSize] = useState(15);
    const [currentTab, setCurrentTab] = useState(TabTypes.DrawTab);

  return(
      <div>
          <div className="App-header">
              <header className="head-band">
                  <label className="App-Logo">Root Note</label>
                  <TabSelector currentTab={TabTypes.DrawTab} setDrawType={setDrawType} setDrawSize={setDrawSize} setDrawColor={setDrawColor}/>
              </header>
              <DrawingCanvas strokeColor={drawColor} drawType={drawType} drawSize={drawSize} canvasHeight={1500} canvasWidth={1500}/>
          </div>
      </div>

  )
}

export default EditorSpace

