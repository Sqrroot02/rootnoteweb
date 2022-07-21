import DrawTab from "./DrawTab";
import DrawingCanvas from "./DrawingCanvas";
import {useRef, useState} from "react";
import DrawTypes from "./enums/DrawTypes";
import "./EditorSpace.css"
import {rgbToHex} from "./helpers/NumberConversion";
import {TabTypes} from "./enums/TabTypes";
import TabSelector from "./TabSelector";
import Sheet from "./Sheet";
import React from "react";

const EditorSpace = (params) => {

    // All Drawing settings saved here:
    const [drawColor, setDrawColor] = useState(rgbToHex(255,255,255));
    const [drawType, setDrawType] = useState(DrawTypes.Free);
    const [drawSize, setDrawSize] = useState(15);
    const [currentTab, setCurrentTab] = useState(TabTypes.DrawTab);

    const sheetRef = useRef();

  return(
      <div>
          <div className="App-header">
              <header className="head-band">
                  <label className="App-Logo">Root Note</label>
                  <TabSelector
                      currentTab={TabTypes.DrawTab}
                      setDrawType={setDrawType}
                      setDrawSize={setDrawSize}
                      setDrawColor={setDrawColor}
                      setParagraph={() => sheetRef.current.addParagraph()}
                      setDrawCanvas={() => sheetRef.current.addCanvas()}
                      setTable={() => sheetRef.current.addTable()}
                      setList={() => sheetRef.current.addList()}/>
              </header>
              <Sheet ref={sheetRef} drawSize={drawSize} drawColor={drawColor} drawType={drawType}/>
          </div>
      </div>

  )
}

export default EditorSpace


