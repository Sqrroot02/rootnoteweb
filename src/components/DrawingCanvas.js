import React, {useEffect, useRef, useState} from "react";
import './DrawingCanvas.css'
import DrawTypes from "./enums/DrawTypes";
import Shape from "./models/Shape";
import {hexToRgb} from "./helpers/NumberConversion";
import "./helpers/Graphics";
import {
    DrawArrow,
    DrawCircle,
    DrawLine,
    DrawRectangle, DrawTriangle, FillPixels, getBorderPixels,
    getColIndex,
    getDestinationArrayIndex,
    getRowIndex
} from "./helpers/Graphics";
import {getLenght} from "./helpers/VectorHelper";
import Vector from "./helpers/Vector";

const DrawingCanvas = ({strokeColor, drawType, drawSize, selectedShapeChanged, canvasWidth, canvasHeight, key}) => {

    const [isMouseClicked, setMouseClicked] = useState(false); // Save current Mouse Click behavior

    const [startX, setStartX] = useState(0); // Start X
    const [startY, setStartY] = useState(0) // Start Y

    const [scrollPosX, setScrollPosX] = useState(0);
    const [scrollPosY, setScrollPosY] = useState(0)

    const [width, setWidth] = useState(1500);
    const [height, setHeight] = useState(1500);

    const [colorIndex, setColorIndex] = useState(256);  // Current shape Index
    const [selectedShape, setSelectedShape] = useState();   // Current selected Shape
    const [shapes, setShapes] = useState([]); // Shape Collection

    const [loaded, setLoaded] = useState(false) // Indicates weather the Object has been loaded for the first time for init

    const canvasRef = useRef(null); // first-Layer canvas
    const contextRef = useRef(null);

    const previewCanvasRef = useRef(null); // secound-Layer canvas
    const previewContextRef = useRef(null);

    const indexCanvasRef = useRef(null); // third-Layer canvas
    const indexContextRef = useRef(null);

    const arrowAngle = 35;

    // on Color changed
    useEffect(() =>{
        if (contextRef.current === null){
            return;
        }

        contextRef.current.strokeStyle = strokeColor;
        contextRef.current.fillStyle = strokeColor;

        previewContextRef.current.strokeStyle = strokeColor;
        previewContextRef.current.fillStyle = strokeColor;

        contextRef.current.lineWidth = drawSize;
        previewContextRef.current.lineWidth = drawSize;
        indexContextRef.current.lineWidth = drawSize;

    },[strokeColor,drawSize])


    // init Effect
    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;

        const context = canvas.getContext("2d");
        contextRef.current = context;
        contextRef.current.lineCap = "round";
        contextRef.current.lineJoin = "round"
        contextRef.current.strokeStyle = strokeColor;
        contextRef.current.fillStyle = strokeColor;
        contextRef.current.lineWidth = 15;
        contextRef.current.imageSmoothingEnabled = true;
        contextRef.current.translate(0.5,0.5);

        const prevCanvas = previewCanvasRef.current;
        prevCanvas.width = canvasWidth;
        prevCanvas.height = canvasHeight;

        const prevContext = prevCanvas.getContext("2d");
        previewContextRef.current = prevContext;
        previewContextRef.current.lineCap = "round";
        previewContextRef.current.lineJoin = "round"
        previewContextRef.current.strokeStyle = strokeColor;
        previewContextRef.current.fillStyle = strokeColor;
        previewContextRef.current.lineWidth = 15;
        previewContextRef.current.imageSmoothingEnabled = true;
        previewContextRef.current.translate(0.5,0.5);

        const inCanavas = indexCanvasRef.current;
        inCanavas.width = canvasWidth;
        inCanavas.height = canvasHeight;

        const inContext = inCanavas.getContext("2d");
        indexContextRef.current = inContext;
        indexContextRef.current.lineWidth = 15;
        indexContextRef.current.lineCap = "round";
        indexContextRef.current.lineJoin = "round"
        indexContextRef.current.imageSmoothingEnabled = true;
        indexContextRef.current.translate(0.5,0.5);

        if (loaded === false){
            setLoaded(true);
        }
    },[])


    // Mouse Down Handler of the Canvas
    const mouseDownHandler = (params) =>{
        params.preventDefault();

        const colorString = "#"+((colorIndex)>>>0).toString(16).slice(-6);

        indexContextRef.current.strokeStyle = colorString;
        indexContextRef.current.fillStyle = colorString;

        let pos = getMouseOnCanvas(params)

        if (drawType === DrawTypes.Free){
            contextRef.current.beginPath();
            contextRef.current.moveTo(pos.x, pos.y);
            contextRef.current.lineTo(pos.x, pos.y);
            contextRef.current.stroke();

            previewContextRef.current.beginPath();
            previewContextRef.current.moveTo(pos.x, pos.y);
            previewContextRef.current.lineTo(pos.x, pos.y);
            previewContextRef.current.stroke();

            indexContextRef.current.beginPath();
            indexContextRef.current.moveTo(pos.x, pos.y);
            indexContextRef.current.lineTo(pos.x, pos.y);
            indexContextRef.current.stroke();
        }
        else if (drawType === DrawTypes.Rectangle){
            previewContextRef.current.moveTo(pos.x, pos.y);
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.moveTo(pos.x, pos.y);
            previewContextRef.current.beginPath();
        }
        else if (drawType === DrawTypes.Line){
            previewContextRef.current.moveTo(pos.x, pos.y);
        }
        else if (drawType === DrawTypes.Arrow){
            previewContextRef.current.moveTo(pos.x, pos.y);
        }
        else if (drawType === DrawTypes.Triangle){
            previewContextRef.current.moveTo(pos.x, pos.y);
        }
        else if (drawType === DrawTypes.None){
            let pixelData = indexContextRef.current.getImageData(pos.x, pos.y,1,1).data;
            let color = [pixelData[0], pixelData[1], pixelData[2]];

            if (color[0] === 0 && color[1] === 0 && color[2] === 0){
                if (selectedShape !== undefined){
                    removeFocusShape(selectedShape,contextRef.current.getImageData(0,0,width,height));
                    setSelectedShape(undefined);
                }
                return;
            }

            let s = shapes.find(x => x.ColorId.r === color[0] && x.ColorId.g === color[1] && x.ColorId.b === color[2]);
            setSelectedShape(s);

            if (s === undefined){
                return;
            }
            focusShape(s,contextRef.current.getImageData(0,0,width,height),hexToRgb(s.FillColor))
        }
        setStartY(pos.y)
        setStartX(pos.x)

        setMouseClicked(true);

        params.preventDefault();
    }

    // Mouse Up Handler of the Canvas
    const mouseUpHandler = (params) =>{
        params.preventDefault();
        setMouseClicked(false);

        const bounds = canvasRef.current.getBoundingClientRect();
        let pos = getMouseOnCanvas(params)

        let endX = pos.x;
        let endY = pos.y

        if (drawType === DrawTypes.Free){
            previewContextRef.current.closePath()
            contextRef.current.closePath();
            indexContextRef.current.closePath();
        }
        else if (drawType === DrawTypes.Rectangle){
            DrawRectangle(contextRef,startX,startY,endX,endY);
            DrawRectangle(indexContextRef,startX,startY,endX,endY);
        }
        else if (drawType === DrawTypes.Circle){
            DrawCircle(contextRef,startX,startY,getLenght(Vector(endX-startX,endY-startY)))
            DrawCircle(indexContextRef,startX,startY,getLenght(Vector(endX-startX,endY-startY)))
        }
        else if (drawType === DrawTypes.Line){
            DrawLine(contextRef,startX - bounds.left,startY- bounds.top,endX,endY)
            DrawLine(indexContextRef,startX - bounds.left,startY- bounds.top,endX,endY)
        }
        else if (drawType === DrawTypes.Arrow){
            DrawArrow(contextRef,startX-bounds.left,startY-bounds.top,endX,endY,arrowAngle,50)
            DrawArrow(indexContextRef,startX-bounds.left,startY-bounds.top,endX,endY,arrowAngle,50)
        }
        else if (drawType === DrawTypes.Triangle){
            DrawTriangle(contextRef,startX-bounds.left,startY-bounds.top,endX,endY);
            DrawTriangle(indexContextRef,startX-bounds.left,startY-bounds.top,endX,endY);
        }
        else if (drawType === DrawTypes.None && selectedShape !== undefined){
            let dx = startX - pos.x;
            let dy = startY - pos.y;

            for (let i = 0; i < selectedShape.Pixels.length; i++) {
                let j = selectedShape.Pixels[i];
                let curX = getColIndex(j,width);
                let curY = getRowIndex(j,width);

                let newIndex = getDestinationArrayIndex(curY-dy, curX - dx,width);
                selectedShape.Pixels[i] = newIndex
            }

            let test = getBorderPixels(selectedShape.Pixels,previewContextRef.current.getImageData(0,0,width,height).data,2,width);

            redrawMainLayer();
            redrawIndexLayer();

            if (selectedShape !== undefined){
                //focusShape(selectedShape,contextRef.current.getImageData(0,0,width,height),hexToRgb(selectedShape.FillColor))
            }

            FillPixels(hexToRgb("#8530c9"),test,contextRef);
            previewContextRef.current.clearRect(0,0,width,height)
        }

        if (drawType !== DrawTypes.None){
            let colorString = "#"+((colorIndex)>>>0).toString(16).slice(-6);
            colorString = colorString[1] + colorString[1] +colorString[2] + colorString[2] + colorString[3] + colorString[3];

            let rgb = hexToRGB(colorString);
            let selected = getFilledPixels(previewContextRef.current.getImageData(0, 0,width,height).data)

            shapes.push(Shape(rgb,contextRef.current.strokeStyle,contextRef.current.strokeStyle,selected))
            setColorIndex(colorIndex+1);
        }
        previewContextRef.current.clearRect(0,0,width,height)
    }

    // Mouse Move Handler of the Canvas
    const mouseMoveHandler = (params) => {
        params.preventDefault();

        if (!isMouseClicked){
            return
        }
        const bounds = canvasRef.current.getBoundingClientRect();

        let pos = getMouseOnCanvas(params)

        let endX = pos.x
        let endY = pos.y

        if (drawType === DrawTypes.Free) {
            contextRef.current.lineTo(pos.x, pos.y);
            contextRef.current.stroke();

            previewContextRef.current.lineTo(pos.x, pos.y);
            previewContextRef.current.stroke();

            indexContextRef.current.lineTo(pos.x, pos.y);
            indexContextRef.current.stroke();
        }
        else if (drawType === DrawTypes.Rectangle){
            previewContextRef.current.clearRect(0,0,width,height)
            DrawRectangle(previewContextRef,startX,startY,endX,endY);
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.clearRect(0,0,width,height)
            DrawCircle(previewContextRef,startX,startY,getLenght(Vector(endX-startX,endY-startY)))
        }
        else if (drawType === DrawTypes.Line){
            previewContextRef.current.clearRect(0,0,width,height)
            DrawLine(previewContextRef,startX - bounds.left,startY - bounds.top,endX,endY)
        }
        else if (drawType === DrawTypes.Arrow){
            previewContextRef.current.clearRect(0,0,width,height)
            DrawArrow(previewContextRef,startX - bounds.left,startY-bounds.top,endX,endY,arrowAngle,50)
        }
        else if (drawType === DrawTypes.Triangle){
            previewContextRef.current.clearRect(0,0,width,height)
            DrawTriangle(previewContextRef,startX- bounds.left,startY-bounds.top,endX,endY);
        }
        // Makes a Shape moveable
        else if (drawType === DrawTypes.None && selectedShape !== undefined){
            previewContextRef.current.clearRect(0,0,width,height)

            let dx = startX - pos.x;
            let dy = startY - pos.y;

            let imageData = previewContextRef.current.getImageData(0,0,width,height);
            let color = hexToRGB(selectedShape.FillColor);

            for (let i = 0; i < selectedShape.Pixels.length; i++) {
                let j = selectedShape.Pixels[i];
                let curX = getColIndex(j,width);
                let curY = getRowIndex(j,width);

                let newIndex = getDestinationArrayIndex(curY-dy, curX - dx,width);

                imageData.data[newIndex] = color.r;
                imageData.data[newIndex+1] = color.g;
                imageData.data[newIndex+2] = color.b;
                imageData.data[newIndex+3] = 255;
            }
            previewContextRef.current.putImageData(imageData,0,0)
        }
        params.preventDefault();
    }

    // Methode for returning pixel Data of a selected shape
    const getSameColorsPixels = (data,color) =>{
        const founded = []

        for (let i = 0; i < data.length; i+=4) {
            if (data[i] === color[0] && data[i+1] === color[1] && data[i+2] === color[2]){
                founded.push(i);
            }
        }
        return founded;
    }

    const getFilledPixels = (data) => {
        const founded = []

        for (let i = 0; i < data.length; i+=4) {
            if (data[i+3] !== 0){
                founded.push(i);
            }
        }
        return founded;
    }

    // Makes a Shape selection visible for the User
    const focusShape = (shape,imageData,color) => {
        const data = imageData.data;
        let indexData = shape.Pixels;
        for (let i = 0; i < indexData.length; i++) {
            data[indexData[i]] = color.r
            data[indexData[i]+1] = color.g
            data[indexData[i]+2] = color.b
            data[indexData[i]+3] = 100
        }
        contextRef.current.putImageData(imageData,0,0)
    }

    const removeFocusShape = (shape, imageData) => {
        const data = imageData.data;
        const indexData = shape.Pixels;
        const color = hexToRgb(shape.FillColor);

        for (let i = 0; i < indexData.length; i++) {
            data[indexData[i]] = color.r
            data[indexData[i]+1] = color.g
            data[indexData[i]+2] = color.b
            data[indexData[i]+3] = 255
        }
        contextRef.current.putImageData(imageData,0,0)
    }

    // Redraws the Main-Interaction Layer
    function redrawMainLayer(){
        contextRef.current.clearRect(0,0,width,height)
        let imageData = contextRef.current.getImageData(0,0,width,height);

        for (let i = 0; i < shapes.length; i++) {
            let color = hexToRgb(shapes[i].FillColor);
            for (let j = 0; j < shapes[i].Pixels.length; j++) {
                imageData.data[shapes[i].Pixels[j]] = color.r;
                imageData.data[shapes[i].Pixels[j]+1] = color.g;
                imageData.data[shapes[i].Pixels[j]+2] = color.b;
                imageData.data[shapes[i].Pixels[j]+3] = 255;
            }
        }
        contextRef.current.putImageData(imageData,0,0)
    }

    // Redraws the Index Layer
    function redrawIndexLayer(){
        indexContextRef.current.clearRect(0,0,width,height)
        let imageData = indexContextRef.current.getImageData(0,0,width,height);

        for (let i = 0; i < shapes.length; i++) {
            let color = shapes[i].ColorId;
            for (let j = 0; j < shapes[i].Pixels.length; j++) {
                imageData.data[shapes[i].Pixels[j]] = color.r;
                imageData.data[shapes[i].Pixels[j]+1] = color.g;
                imageData.data[shapes[i].Pixels[j]+2] = color.b;
                imageData.data[shapes[i].Pixels[j]+3] = 255;
            }
        }
        indexContextRef.current.putImageData(imageData,0,0)
    }


    // Returns an RGB combination from a Hex value
    const hexToRGB = (hex) => {
        let aRgbHex = hex.match(/.{1,2}/g);

        let r = parseInt(aRgbHex[0],16);
        let g = parseInt(aRgbHex[1],16);
        let b = parseInt(aRgbHex[2], 16);

        return({r,g,b});
    }

    function getMouseOnCanvas(params){
        const boundX = params.clientX || params.touches[0].clientX
        const boundY = params.clientY || params.touches[0].clientY
        const x = boundX - params.target.offsetLeft
        const y = boundY - params.target.offsetTop + window.scrollY

        return{x, y}
    }

    function getSLs(data){
        let sls = [];

        let before = 0;
        let start = 0;

        for (let i = 0; i < data.length; i++) {
            if (data[i] - before === 4 || before === 0){
                before = data[i];
            }
            else if (start === i){
                before = data[i];
                start++;
            }
            else {
                sls.push({s: data[start], l: i-start})
                start = i+1;
            }
        }
        return sls;
    }

    function getPixelOfSLs(sls){
        let pixels = []
        for (let i = 0; i < sls.length; i++) {
            for (let j = 0; j < sls[i].l* 4; j+=4) {
                pixels.push(sls[i].s + j)
            }
        }
        return pixels
    }


    return(
        <div style={{display: "flex", flexDirection:"column"}}>
           <div style={{display: "flex", flexDirection:"row"}}>
               <div className="outer-canvas-container">
                   <canvas
                       onMouseDown={mouseDownHandler}
                       onMouseMove={mouseMoveHandler}
                       onMouseUp={mouseUpHandler}
                       onTouchStart={mouseDownHandler}
                       onTouchMove={mouseMoveHandler}
                       onTouchEnd={mouseUpHandler}
                       ref={canvasRef}
                       id="drawing-canvas"
                       className="drawing-canvas"/>
                   <canvas ref={previewCanvasRef}
                           id="preview-canvas"
                           className="preview-canvas-canvas"/>
                   <canvas className="index-canvas"
                           id="index-canvas"
                           ref={indexCanvasRef}/>
               </div>
               <div className="thumb-right" style={{width:10, background:"blue"}}/>
           </div>
            <div className="thumb-bottom" style={{height:10, background:"blue"}}/>
        </div>
    );
}

export default DrawingCanvas;