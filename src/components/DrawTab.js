import "./DrawTab.css"
import IconButton from "./IconButton";
import DrawTypeDropDown from "./dropdowns/DrawTypeDropDown"
import {useState} from "react";
import LabeledInput from "./LabeledInput";

const DrawTab = ({setSelectedColor, setDrawType, setDrawSize}) => {
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

    function onColorClicked(){

    }

    const handleDrawTypeChanged = num => {
        setDrawType(num);
    }

    const handleDrawSizeChanged = (e) =>{
        setDrawSize(e.target.value);
    }

    return(
        <div className="outer-container">
            <IconButton className="tool-button" icon="./icons/pen-solid.svg" onClick={onClick}/>
            <IconButton className="tool-button" icon="./icons/shapes-solid.svg" onClick={onDrawTypeClicked}/>
            <LabeledInput title="Line Width" className="line-^size-input" onChange={handleDrawSizeChanged}/>
            <IconButton className="tool-button" icon="./icons/palette-solid.svg" onClick={onColorClicked}/>
            <DrawTypeDropDown isOpen={isDrawTypeVisible} onSelectionChanged={handleDrawTypeChanged}/>
        </div>

    )
}

export default DrawTab
