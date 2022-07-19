import {useRef, useState, useEffect} from "react";
import "./ColorPicker.css"
import {rgbToHex} from "../helpers/NumberConversion";
import IconButton from "../IconButton";
import {Button} from "react-bootstrap";


const ColorPicker = ({onColorChanged, className, width, height,isOpen, top, left}) => {

    const [selectedColor, setSelectedColor] = useState([0,0,0]);

    const [mouseHuePressed, setMouseHuePressed] = useState(null);
    const [mouseColorPressed, setMouseColorPressed] = useState(null);

    const [colorPointer, setColorPointer] = useState(null);

    const [opacity, setOpacity] = useState(0);
    const [open, setOpen] = useState("visible");

    const canvasColor = useRef(null)
    const canvasHue = useRef(null)

    const canvasColorContext = useRef(null)
    const canvasHueContext = useRef(null)

    useEffect(() =>{
        canvasColor.current.width = width * 0.5
        canvasColor.current.height = height * 0.485

        canvasHue.current.width = width * 0.5
        canvasHue.current.height = height * 0.485

        canvasColorContext.current = canvasColor.current.getContext("2d");
        canvasHueContext.current = canvasHue.current.getContext("2d");

        const linGradient = canvasColorContext.current.createLinearGradient(0,0,0,canvasColor.current.height);
        linGradient.addColorStop(0,"rgb(255,0,0)");
        linGradient.addColorStop(0.17,"rgb(255,255,0)");
        linGradient.addColorStop(0.33,"rgb(0,255,0)");
        linGradient.addColorStop(0.52,"rgb(0,255,255)");
        linGradient.addColorStop(0.66,"rgb(0,0,255)");
        linGradient.addColorStop(1,"rgb(255,0,0)");

        canvasColorContext.current.beginPath()
        canvasColorContext.current.rect(0,0,canvasColor.current.width,canvasColor.current.height)
        canvasColorContext.current.fillStyle = linGradient;
        canvasColorContext.current.fill();
        canvasColorContext.current.closePath();

        const linGradientHue = canvasHueContext.current.createLinearGradient(0,0,0,canvasHue.current.height);
        linGradientHue.addColorStop(0,"rgb(0,0,0)");
        linGradientHue.addColorStop(0.5, "rgb(128,128,128)");
        linGradientHue.addColorStop(1, "rgb(255,255,255)");

        canvasHueContext.current.beginPath();
        canvasHueContext.current.rect(0,0,canvasHue.current.width,canvasHue.current.height)
        canvasHueContext.current.fillStyle = linGradientHue
        canvasHueContext.current.fill();
        canvasHueContext.current.closePath();

    },[])

    const mouseDownColor = (params) => {
        const bounds = canvasColor.current.getBoundingClientRect();
        setColorPointer([params.clientX - bounds.left,params.clientY - bounds.top])
        let pixelData = canvasColorContext.current.getImageData(params.clientX - bounds.left,params.clientY - bounds.top,1,1).data;
        let color = [pixelData[0], pixelData[1], pixelData[2]];

        setSelectedColor(color);
        setMouseColorPressed(true);
    }

    const mouseDownHue = (params) => {
        const bounds = canvasHue.current.getBoundingClientRect();
        let pixelData = canvasHueContext.current.getImageData(params.clientX - bounds.left,params.clientY - bounds.top,1,1).data;
        let color = [pixelData[0], pixelData[1], pixelData[2]];

        changeHue(color[0])

        let pixelDataColor = canvasColorContext.current.getImageData(colorPointer[0],colorPointer[1],1,1).data;
        let colorOfColor = [pixelData[0], pixelData[1], pixelData[2]];
        setSelectedColor(colorOfColor);

        setMouseHuePressed(true)
    }

    const mouseMoveColor = (params) => {
        if (!mouseColorPressed){
            return;
        }

        const bounds = canvasColor.current.getBoundingClientRect();
        let pixelData = canvasColorContext.current.getImageData(params.clientX - bounds.left,params.clientY - bounds.top,1,1).data;
        let color = [pixelData[0], pixelData[1], pixelData[2]];

        setColorPointer([params.clientX - bounds.left,params.clientY - bounds.top])
        setSelectedColor(color);
    }

    const mouseMoveHue = (params) => {
        if (!mouseHuePressed){
            return
        }
        const bounds = canvasHue.current.getBoundingClientRect();
        let pixelData = canvasHueContext.current.getImageData(params.clientX - bounds.left,params.clientY - bounds.top,1,1).data;
        let color = [pixelData[0], pixelData[1], pixelData[2]];

        changeHue(color[0])

        let pixelDataColor = canvasColorContext.current.getImageData(colorPointer[0],colorPointer[1],1,1).data;
        let colorOfColor = [pixelData[0], pixelData[1], pixelData[2]];
        setSelectedColor(colorOfColor);
    }

    const mouseUpColor = () => {
        setMouseColorPressed(false);
    }

    const mouseUpHue = () => {
        setMouseHuePressed(false);
    }

    function changeHue(hue){
        canvasColorContext.current.clearRect(0,0,canvasHue.current.width,canvasHue.current.height)
        const linGradient = canvasColorContext.current.createLinearGradient(0,0,0,canvasColor.current.height);

        linGradient.addColorStop(0,"rgb("+ hue +",0,0)");
        linGradient.addColorStop(0.17,"rgb("+ hue +","+ hue +",0)");
        linGradient.addColorStop(0.33,"rgb(0,"+ hue +",0)");
        linGradient.addColorStop(0.52,"rgb(0,"+ hue +","+ hue +")");
        linGradient.addColorStop(0.66,"rgb(0,0,"+ hue +")");
        linGradient.addColorStop(1,"rgb("+ hue +",0,0)");

        canvasColorContext.current.beginPath()
        canvasColorContext.current.rect(0,0,canvasColor.current.width,canvasColor.current.height)
        canvasColorContext.current.fillStyle = linGradient;
        canvasColorContext.current.fill();
        canvasColorContext.current.closePath();
    }

    useEffect(() =>{
        if (isOpen === true){
            setOpen("visible");
            setOpacity(1);
        }
        else {
            setOpen("collapse")
            setOpacity(0);
        }

    },[isOpen])


    function onMouseLeave() {
        onColorChanged(selectedColor)
        setOpen("collapse")
        setOpacity(0);
        isOpen = false
    }

    function onSelect(color){
        onColorChanged(selectedColor)
        setOpen("collapse")
        setOpacity(0);
        isOpen = false
    }

    return(
        <div className="outer-container1" style={{height: height, width: width, visibility: open, opacity: opacity, marginTop:top, left:left }} onMouseLeave={onMouseLeave}>
            <div className="inner-box1" style={{height: height, width: width, visibility: open, opacity: opacity }}>
                <div className="picker-box1">
                    <canvas className="color-col1" ref={canvasColor} onMouseDown={mouseDownColor} onMouseMove={mouseMoveColor} onMouseUp={mouseUpColor}/>
                    <div style={{height: "3%"}}/>
                    <canvas className="hue-col1" ref={canvasHue} onMouseDown={mouseDownHue} onMouseMove={mouseMoveHue} onMouseUp={mouseUpHue}/>
                </div>
                <div className="preview-box1">
                    <div className="picker-showcase" style={{background: rgbToHex(selectedColor[0], selectedColor[1], selectedColor[2])}}>
                        <p>{rgbToHex(selectedColor[0], selectedColor[1], selectedColor[2])}</p>
                    </div>
                    <Button onClick={onSelect} className="ApplyButton">Apply</Button>
                </div>
            </div>
        </div>
    )
}

export default ColorPicker