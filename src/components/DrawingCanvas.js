import React, {useEffect, useRef, useState} from "react";
import './DrawingCanvas.css'
import DrawTypes from "./enums/DrawTypes";
import Shape from "./models/Shape";
import {getNodeText} from "@testing-library/react";

const DrawingCanvas = ({strokeColor, drawType, drawSize}) => {

    const [isMouseClicked, setMouseClicked] = useState(false);

    const [startX, setStartX] = useState(0);
    const [startY, setStartY] = useState(0)

    const [colorIndex, setColorIndex] = useState(256);
    const [selectedIndexColor,setSelectedIndexColor ] = useState([0,0,0])
    const [selectedShape, setSelectedShape] = useState();
    const [shapes, setShapes] = useState([]);

    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    const previewCanvasRef = useRef(null);
    const previewContextRef = useRef(null);

    const indexCanvasRef = useRef(null);
    const indexContextRef = useRef(null);

    const width = 1500;
    const height = 1500;

    // on Color changed
    useEffect(() =>{
        if (contextRef.current === null){
            return;
        }

        contextRef.current.strokeStyle = strokeColor;
        contextRef.current.fillStyle = strokeColor;

        previewContextRef.strokeStyle = strokeColor;
        previewContextRef.fillStyle = strokeColor;

        contextRef.current.lineWidth = drawSize;
        previewContextRef.current.lineWidth = drawSize;
        indexContextRef.current.lineWidth = drawSize;

    },[strokeColor,drawSize])


    // init Effect
    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = 1500;
        canvas.height = 1500;

        const context = canvas.getContext("2d");
        contextRef.current = context;
        contextRef.current.lineCap = "round";
        contextRef.current.strokeStyle = strokeColor;
        contextRef.current.lineWidth = 15;

        const prevCanvas = previewCanvasRef.current;
        prevCanvas.width = 1500;
        prevCanvas.height = 1500;

        const prevContext = prevCanvas.getContext("2d");
        previewContextRef.current = prevContext;
        previewContextRef.current.lineCap = "round";
        previewContextRef.current.strokeStyle = strokeColor;
        previewContextRef.current.lineWidth = 15;

        const inCanavas = indexCanvasRef.current;
        inCanavas.width = 1500;
        inCanavas.height = 1500;

        const inContext = inCanavas.getContext("2d");
        indexContextRef.current = inContext;
        indexContextRef.current.lineWidth = 15;
        indexContextRef.current.lineCap = "round";

        if (loaded === false){

            setLoaded(true);
            document.body.addEventListener("touchstart", function (e) {
                if (e.target === canvas) {
                    e.preventDefault();
                }
            }, false);
            document.body.addEventListener("touchend", function (e) {
                if (e.target === canvas) {
                    e.preventDefault();
                }
            }, false);
            document.body.addEventListener("touchmove", function (e) {
                if (e.target === canvas) {
                    e.preventDefault();
                }
            }, false);
        }

    },[])

    const [loaded, setLoaded] = useState(false)


    // Mouse Down Handler of the Canvas
    const mouseDownHandler = (params) =>{
        params.preventDefault();
        const bounds = canvasRef.current.getBoundingClientRect();

        const colorString = "#"+((colorIndex)>>>0).toString(16).slice(-6);

        indexContextRef.current.strokeStyle = colorString;
        indexContextRef.current.fillStyle = colorString;

        if (drawType === DrawTypes.Free){
            contextRef.current.beginPath();
            contextRef.current.moveTo(params.clientX - bounds.left, params.clientY - bounds.top);
            contextRef.current.lineTo(params.clientX - bounds.left, params.clientY - bounds.top);
            contextRef.current.stroke();

            // Index Paint Path begin
            indexContextRef.current.beginPath();
            indexContextRef.current.moveTo(params.clientX - bounds.left, params.clientY - bounds.top);
            indexContextRef.current.lineTo(params.clientX - bounds.left, params.clientY - bounds.top);
            indexContextRef.current.stroke();
        }
        else if (drawType === DrawTypes.Rectangle){
            previewContextRef.current.moveTo(params.clientX - bounds.left, params.clientY - bounds.top);
            setStartY(params.clientY - bounds.top)
            setStartX(params.clientX - bounds.left)
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.moveTo(params.clientX - bounds.left, params.clientY - bounds.top);
            setStartY(params.clientY - bounds.top)
            setStartX(params.clientX - bounds.left)
            previewContextRef.current.beginPath();
        }
        else if (drawType === DrawTypes.None){
            let pixelData = indexContextRef.current.getImageData(params.clientX - bounds.left,params.clientY - bounds.top,1,1).data;
            let color = [pixelData[0], pixelData[1], pixelData[2]];

            setSelectedIndexColor([color.at(0), color.at(1), color.at(2)]);

            let selected = getSameColorsPixels(indexContextRef.current.getImageData(0, 0,1500,1500).data,selectedIndexColor)

            setSelectedShape(Shape(selectedIndexColor,contextRef.current.strokeStyle,contextRef.current.strokeStyle,selected));
            shapes.push(Shape(selectedIndexColor,contextRef.current.strokeStyle,contextRef.current.strokeStyle,selected))

            setStartY(params.clientY - bounds.top)
            setStartX(params.clientX - bounds.left)

            focusShape(selected,contextRef.current.getImageData(0,0,1500,1500),[235, 64, 52])
        }

        setMouseClicked(true);
        setColorIndex(colorIndex+1);

        params.preventDefault();
    }

    // Mouse Up Handler of the Canvas
    const mouseUpHandler = (params) =>{
        params.preventDefault();
        setMouseClicked(false);

        const bounds = canvasRef.current.getBoundingClientRect();
        let endX = params.clientX - bounds.left;
        let endY = params.clientY - bounds.top;

        if (drawType === DrawTypes.Free){
            contextRef.current.closePath();
            indexContextRef.current.closePath();
        }
        else if (drawType === DrawTypes.Rectangle){
            previewContextRef.current.clearRect(0,0,1500,1500)
            contextRef.current.fillRect(startX,startY,endX - startX, endY - startY);
            contextRef.current.closePath();

            indexContextRef.current.fillRect(startX,startY,endX - startX, endY - startY);
            indexContextRef.current.closePath();
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.clearRect(0,0,1500,1500)

            contextRef.current.beginPath();
            contextRef.current.arc(startX, startY, endX-startX, 0, 2 * Math.PI);
            contextRef.current.closePath();
            contextRef.current.fill();

            indexContextRef.current.beginPath();
            indexContextRef.current.arc(startX, startY, endX-startX, 0, 2 * Math.PI);
            indexContextRef.current.closePath();
            indexContextRef.current.fill();
        }

        if (drawType !== DrawTypes.None){
            let selected = getSameColorsPixels(indexContextRef.current.getImageData(0, 0,1500,1500).data,selectedIndexColor)
        }
    }

    // Mouse Move Handler of the Canvas
    const mouseMoveHandler = (params) => {
        params.preventDefault();
        if (!isMouseClicked){
            return
        }
        const bounds = canvasRef.current.getBoundingClientRect();
        let endX = params.clientX - bounds.left;
        let endY = params.clientY - bounds.top;

        if (drawType === DrawTypes.Free) {
            contextRef.current.lineTo(params.clientX - bounds.left, params.clientY - bounds.top);
            contextRef.current.stroke();

            indexContextRef.current.lineTo(params.clientX - bounds.left, params.clientY - bounds.top);
            indexContextRef.current.stroke();
        }
        else if (drawType === DrawTypes.Rectangle){
            previewContextRef.current.clearRect(0,0,1500,1500)
            previewContextRef.current.fillRect(startX,startY,endX - startX, endY - startY);
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.clearRect(0,0,1500,1500)
            previewContextRef.current.arc(startX, startY, endX-startX, 0, 2 * Math.PI);
            previewContextRef.current.fill();
        }
        // Makes a Shape Moveable
        else if (drawType === DrawTypes.None){
            previewContextRef.current.clearRect(0,0,1500,1500)

            let dx = startX - params.clientX - bounds.left;
            let dy = startY - params.clientY - bounds.top;
            let imageData = previewContextRef.current.getImageData(0,0,1500,1500);

            let color = hexToRGB(selectedShape.FillColor);
            for (let i = 0; i < selectedShape.Pixels.length; i++) {
                let j = selectedShape.Pixels[i];
                let curX = getColIndex(j);
                let curY = getRowIndex(j);

                let newIndex = getDestinationArrayIndex(curY-dy, curX - dx);
                selectedShape.Pixels[i] = newIndex

                imageData.data[newIndex] = color.r;
                imageData.data[newIndex+1] = color.g;
                imageData.data[newIndex+2] = color.b;
                imageData.data[newIndex+3] = 255;
            }

            previewContextRef.current.putImageData(imageData,0,0)

            setStartY(params.clientY - bounds.top)
            setStartX(params.clientX - bounds.left)
        }

        params.preventDefault();
    }

    // Methode for returning pixel Data of a selected shape
    const getSameColorsPixels = (data,color) =>{
        const founded = [];
        const lastSearch = []

        for (let i = 0; i <data.length ; i+=4) {
            if (!(data[i] === 0 && data[i+1] === 0 && data[i+2] === 0)){
                founded.push(i);
            }
        }

        for (let i = 0; i < founded.length; i++) {
            if (data[founded[i]] === color[0] && data[founded[i]+1] === color[1] && data[founded[i] +2] === color[2]){
                lastSearch.push(founded[i]);
            }
        }
        return lastSearch;
    }

    const focusShape = (indexData, imageData,color) => {

        const data = imageData.data;
        for (let i = 0; i < indexData.length; i++) {
            data[indexData[i]] = 120
            data[indexData[i]+1] = 243
            data[indexData[i]+2] = 30
            data[indexData[i]+3] = 255
        }
        contextRef.current.putImageData(imageData,0,0)
    }

    // Returns the Pixel index from an Array index
    const getPixelIndex = (arrayIndex) =>{
        return arrayIndex / 4;
    }

    // Returns the row Number of a pixel in an Array
    const getRowIndex = (arrayIndex) =>{
        return Math.floor(getPixelIndex(arrayIndex)/width)
    }

    // Returns the column Number of a pixel in an Array
    const getColIndex = (arrayIndex) => {
        return getPixelIndex(arrayIndex) % width;
    }

    // Returns the pixel index by row and column
    const getDestinationIndex = (row,col) =>{
        return row * width + col;
    }

    // Returns the array index by row and column
    const getDestinationArrayIndex = (row, col) =>{
        return getDestinationIndex(row,col) * 4;
    }

    // Returns an RGB combination from a Hex value
    const hexToRGB = (hex) => {
        let aRgbHex = hex.match(/.{1,2}/g);
        let r = parseInt(aRgbHex[0],16);
        let g = parseInt(aRgbHex[1],16);
        let b = parseInt(aRgbHex[2], 16);
        return({r,g,b});
    }


    return(
        <div>
            <canvas
                onMouseDown={mouseDownHandler}
                onMouseMove={mouseMoveHandler}
                onMouseUp={mouseUpHandler}
                onTouchStart={mouseDownHandler}
                onTouchMove={mouseMoveHandler}
                onTouchEnd={mouseUpHandler}
                ref={canvasRef}
                id="drawing-canvas"
                className="drawing-canvas"
            />
            <canvas
                ref={previewCanvasRef}
                id="preview-canvas"
                className="preview-canvas-canvas"
            />
            <canvas className="index-canvas"
                    id="index-canvas"
                    ref={indexCanvasRef}/>
        </div>
    );
}


export default DrawingCanvas;


