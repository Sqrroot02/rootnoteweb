import "./DrawTab.css"
import IconButton from "./IconButton";
import DrawTypeDropDown from "./dropdowns/DrawTypeDropDown"
import {useState} from "react";

const DrawTab = ({setSelectedColor, setDrawType}) => {
    let state = false;

    const [isDrawTypeVisible, setIsDrawTypeVisible] = useState();

    function onClick() {
        if (state === false){
            setSelectedColor("#4287f5");
            state = true;
        }
        else{
            setSelectedColor("#000000");
            state = false;
        }
    }

    function onDrawTypeClicked(){
        if (isDrawTypeVisible === true){
            setIsDrawTypeVisible(false);
        }
        else {
            setIsDrawTypeVisible(true);
        }
    }

    const handleDrawTypeChanged = num => {
        setDrawType(num);
    }

    return(
        <div className="outer-container">
            <IconButton className="tool-button" icon="./icons/pen-solid.svg" onClick={onClick}/>
            <IconButton className="tool-button" icon="./icons/shapes-solid.svg" onClick={onDrawTypeClicked} text="fdsdf"/>
            <input className="line-size-input"/>
            <DrawTypeDropDown isOpen={isDrawTypeVisible} onSelectionChanged={handleDrawTypeChanged}/>
        </div>

    )
}

export default DrawTab
