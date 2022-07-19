import "./DrawTab.css"
import IconButton from "./IconButton";
import DrawTypeDropDown from "./dropdowns/DrawTypeDropDown"
import {useState} from "react";
import LabeledInput from "./LabeledInput";
import ColorPicker from "./colorpicker/ColorPicker"
import {rgbToHex} from "./helpers/NumberConversion";

const DrawTab = ({setSelectedColor, setDrawType, setDrawSize}) => {
    let state = false;

    const [isDrawTypeVisible, setIsDrawTypeVisible] = useState();
    const [isColorVisible, setIsColorVisible] = useState();
    const [color, setColor] = useState("#ffffff");

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
            setIsColorVisible(false);
        }
    }

    function onColorClicked(){
        if (isColorVisible === true){
            setIsColorVisible(false);
        }
        else {
            setIsColorVisible(true);
            setIsDrawTypeVisible(false)
        }
    }

    const handleDrawTypeChanged = num => {
        setDrawType(num);
    }

    const handleDrawSizeChanged = (e) =>{
        setDrawSize(e.target.value);
    }

    const handleColorChanged = (e) =>{
        setSelectedColor(rgbToHex(e[0], e[1], e[2]))
        setColor(rgbToHex(e[0], e[1], e[2]));
    }

    return(
        <div className="outer-container">
            <IconButton className="tool-button"onClick={onClick}>
                <img src="./icons/pen-solid.svg"/>
            </IconButton>
            <IconButton className="tool-button" onClick={onDrawTypeClicked}>
                <img src="./icons/shapes-solid.svg"/>
            </IconButton>
            <LabeledInput min={0} max={100} type="number" text="15" title="Line Width" className="line-size-input" onChange={handleDrawSizeChanged}/>
            <IconButton className="tool-button" icon="./icons/palette-solid.svg" onClick={onColorClicked}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512">
                    <path fill={color} d="M512 255.1C512 256.9 511.1 257.8 511.1 258.7C511.6 295.2 478.4 319.1 441.9 319.1H344C317.5 319.1 296 341.5 296 368C296 371.4 296.4 374.7 297 377.9C299.2 388.1 303.5 397.1 307.9 407.8C313.9 421.6 320 435.3 320 449.8C320 481.7 298.4 510.5 266.6 511.8C263.1 511.9 259.5 512 256 512C114.6 512 0 397.4 0 256C0 114.6 114.6 0 256 0C397.4 0 512 114.6 512 256V255.1zM96 255.1C78.33 255.1 64 270.3 64 287.1C64 305.7 78.33 319.1 96 319.1C113.7 319.1 128 305.7 128 287.1C128 270.3 113.7 255.1 96 255.1zM128 191.1C145.7 191.1 160 177.7 160 159.1C160 142.3 145.7 127.1 128 127.1C110.3 127.1 96 142.3 96 159.1C96 177.7 110.3 191.1 128 191.1zM256 63.1C238.3 63.1 224 78.33 224 95.1C224 113.7 238.3 127.1 256 127.1C273.7 127.1 288 113.7 288 95.1C288 78.33 273.7 63.1 256 63.1zM384 191.1C401.7 191.1 416 177.7 416 159.1C416 142.3 401.7 127.1 384 127.1C366.3 127.1 352 142.3 352 159.1C352 177.7 366.3 191.1 384 191.1z"/>
                </svg>
            </IconButton>
            <DrawTypeDropDown isOpen={isDrawTypeVisible} onSelectionChanged={handleDrawTypeChanged}/>
            <ColorPicker onColorChanged={handleColorChanged} left={270} top={62} isOpen={isColorVisible} className="color-picker" width={400} height={600}/>
        </div>

    )
}

export default DrawTab
