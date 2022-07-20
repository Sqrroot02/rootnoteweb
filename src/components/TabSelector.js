import {useEffect, useState} from "react";
import {TabTypes} from "./enums/TabTypes";
import DrawTab from "./DrawTab";
import ElementsTab from "./ElementsTab";
import "./TabSelector.css"

const TabSelector = ({currentTab,setDrawColor, setDrawType, setDrawSize, setDrawCanvas, setParagraph, setTable, setList}) => {

    const [tab,setTab] = useState(<DrawTab/>);

    useEffect(() =>{
        if (currentTab === TabTypes.DrawTab) {
            setTab(<DrawTab setDrawSize={setDrawSize} setDrawType={setDrawType} setSelectedColor={setDrawColor}/>)
        }
        else if (currentTab === TabTypes.ElementsTab){
            setTab(<ElementsTab/>)
        }

    },[currentTab])

    function drawClick(){
        setTab(<DrawTab setDrawSize={setDrawSize} setDrawType={setDrawType} setSelectedColor={setDrawColor}/>)
    }

    function addClick(){
        setTab(<ElementsTab setParagraph={setParagraph} setDrawCanvas={setDrawCanvas} setList={setList} setTable={setTable}/>)
    }

    return(
        <div className="selector-container">
            <div className="tabs">
                <button className="tab-button" onClick={drawClick}>
                    <span className="tab-font">DRAW</span>
                    <span className="tab-visual"/>
                </button>
                <button className="tab-button" onClick={addClick}>
                    <span className="tab-font">ADD</span>
                    <span className="tab-visual"/>
                </button>
                <button className="tab-button">
                    <span className="tab-font">WRITE</span>
                    <span className="tab-visual"/>
                </button>
            </div>
            {tab}
        </div>
    )
}

export default TabSelector