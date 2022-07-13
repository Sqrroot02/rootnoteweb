import React, {useEffect, useRef, useState} from "react";
import './DrawingCanvas.css'
import DrawTypes from "./enums/DrawTypes";
import Shape from "./models/Shape";
import {hexToRgb} from "./helpers/NumberConversion";
import Vector from "./helpers/Vector";
import {addVector, changeVectorLenght, degToRad, rotateVector} from "./helpers/VectorHelper";

const DrawingCanvas = ({strokeColor, drawType, drawSize, selectedShapeChanged, canvasWidth, canvasHeight}) => {

    const [isMouseClicked, setMouseClicked] = useState(false); // Save current Mouse Click behavior

    const [startX, setStartX] = useState(0); // Start X
    const [startY, setStartY] = useState(0) // Start Y

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
        canvas.width = 1500;
        canvas.height = 1500;

        const context = canvas.getContext("2d");
        contextRef.current = context;
        contextRef.current.lineCap = "round";
        contextRef.current.lineJoin = "round"
        contextRef.current.strokeStyle = strokeColor;
        contextRef.current.fillStyle = strokeColor;
        contextRef.current.lineWidth = 15;
        //contextRef.current.imageSmoothingEnabled = false

        const prevCanvas = previewCanvasRef.current;
        prevCanvas.width = 1500;
        prevCanvas.height = 1500;

        const prevContext = prevCanvas.getContext("2d");
        previewContextRef.current = prevContext;
        previewContextRef.current.lineCap = "round";
        previewContextRef.current.lineJoin = "round"
        previewContextRef.current.strokeStyle = strokeColor;
        previewContextRef.current.fillStyle = strokeColor;
        previewContextRef.current.lineWidth = 15;
        //previewContextRef.current.imageSmoothingEnabled = false

        const inCanavas = indexCanvasRef.current;
        inCanavas.width = 1500;
        inCanavas.height = 1500;

        const inContext = inCanavas.getContext("2d");
        indexContextRef.current = inContext;
        indexContextRef.current.lineWidth = 15;
        indexContextRef.current.lineCap = "round";
        indexContextRef.current.lineJoin = "round"
        //indexContextRef.current.imageSmoothingEnabled = false

        if (loaded === false){

            setLoaded(true);

        }

    },[])


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
        else if (drawType === DrawTypes.Line){
            previewContextRef.current.moveTo(params.clientX - bounds.left, params.clientY - bounds.top);
            setStartY(params.clientY - bounds.top)
            setStartX(params.clientX - bounds.left)
        }
        else if (drawType === DrawTypes.Arrow){
            previewContextRef.current.moveTo(params.clientX - bounds.left, params.clientY - bounds.top);
            setStartY(params.clientY - bounds.top)
            setStartX(params.clientX - bounds.left)
        }
        else if (drawType === DrawTypes.None){
            let pixelData = indexContextRef.current.getImageData(params.clientX - bounds.left,params.clientY - bounds.top,1,1).data;
            let color = [pixelData[0], pixelData[1], pixelData[2]];

            console.log(color)
            if (color[0] === 0 && color[1] === 0 && color[2] === 0){
                if (selectedShape !== undefined){
                    removeFocusShape(selectedShape,contextRef.current.getImageData(0,0,width,height));
                    setSelectedShape(undefined);
                }
                return;
            }

            let s = shapes.find(x => x.ColorId.r === color[0] && x.ColorId.g === color[1] && x.ColorId.b === color[2]);
            setSelectedShape(s);

            setStartY(params.clientY - bounds.top)
            setStartX(params.clientX - bounds.left)

            if (s === undefined){
                return;
            }
            focusShape(s.Pixels,contextRef.current.getImageData(0,0,width,height),hexToRgb(s.FillColor))
        }

        setMouseClicked(true);

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
            previewContextRef.current.clearRect(0,0,width,height)
            contextRef.current.fillRect(startX,startY,endX - startX, endY - startY);
            contextRef.current.closePath();

            indexContextRef.current.fillRect(startX,startY,endX - startX, endY - startY);
            indexContextRef.current.closePath();
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.clearRect(0,0,width,height)

            contextRef.current.beginPath();
            contextRef.current.arc(startX, startY, endX-startX, 0, 2 * Math.PI);
            contextRef.current.closePath();
            contextRef.current.fill();

            indexContextRef.current.beginPath();
            indexContextRef.current.arc(startX, startY, endX-startX, 0, 2 * Math.PI);
            indexContextRef.current.closePath();
            indexContextRef.current.fill();
        }
        else if (drawType === DrawTypes.Line){
            previewContextRef.current.clearRect(0,0,width,height)

            contextRef.current.beginPath();
            contextRef.current.moveTo(startX - bounds.left, startY- bounds.top);
            contextRef.current.lineTo(endX,endY);
            contextRef.current.stroke();

            indexContextRef.current.beginPath();
            indexContextRef.current.moveTo(startX - bounds.left, startY- bounds.top);
            indexContextRef.current.lineTo(endX,endY);
            indexContextRef.current.stroke();
        }
        else if (drawType === DrawTypes.Arrow){
            previewContextRef.current.clearRect(0,0,width,height)

            contextRef.current.beginPath();
            contextRef.current.moveTo(startX - bounds.left, startY- bounds.top);
            contextRef.current.lineTo(endX,endY);

            let vec = Vector(startX-endX, startY - endY);
            let vecLeft = rotateVector(vec,degToRad(arrowAngle));
            let vecRight = rotateVector(vec,-degToRad(arrowAngle));

            let vecEndLeft = addVector(Vector(endX,endY),changeVectorLenght(vecLeft, 50))
            let vecEndRight = addVector(Vector(endX,endY),changeVectorLenght(vecRight,50))

            contextRef.current.moveTo(endX - bounds.left, endY- bounds.top);
            contextRef.current.lineTo(vecEndLeft.x,vecEndLeft.y);
            contextRef.current.moveTo(endX - bounds.left, endY- bounds.top);
            contextRef.current.lineTo(vecEndRight.x, vecEndRight.y);
            contextRef.current.stroke();

            indexContextRef.current.beginPath();
            indexContextRef.current.moveTo(startX - bounds.left, startY- bounds.top);
            indexContextRef.current.lineTo(endX,endY);

            indexContextRef.current.moveTo(endX - bounds.left, endY- bounds.top);
            indexContextRef.current.lineTo(vecEndLeft.x,vecEndLeft.y);
            indexContextRef.current.moveTo(endX - bounds.left, endY- bounds.top);
            indexContextRef.current.lineTo(vecEndRight.x, vecEndRight.y);
            indexContextRef.current.stroke();
        }
        else if (drawType === DrawTypes.None && selectedShape !== undefined){
            previewContextRef.current.clearRect(0,0,width,height)

            let dx = startX - params.clientX - bounds.left;
            let dy = startY - params.clientY - bounds.top;
            for (let i = 0; i < selectedShape.Pixels.length; i++) {
                let j = selectedShape.Pixels[i];
                let curX = getColIndex(j);
                let curY = getRowIndex(j);

                let newIndex = getDestinationArrayIndex(curY-dy, curX - dx);
                selectedShape.Pixels[i] = newIndex
            }

            redrawMainLayer();
            redrawIndexLayer();

            if (selectedShape !== undefined){
                focusShape(selectedShape,contextRef.current.getImageData(0,0,width,height))
            }
        }

        if (drawType !== DrawTypes.None){
            let colorString = "#"+((colorIndex)>>>0).toString(16).slice(-6);
            colorString = colorString[1] + colorString[1] +colorString[2] + colorString[2] + colorString[3] + colorString[3];

            let rgb = hexToRGB(colorString);

            let selected = getSameColorsPixels(indexContextRef.current.getImageData(0, 0,width,height).data,[rgb.r,rgb.g,rgb.b])
            shapes.push(Shape(rgb,contextRef.current.strokeStyle,contextRef.current.strokeStyle,selected))
            setColorIndex(colorIndex+1);
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
            previewContextRef.current.clearRect(0,0,width,height)
            previewContextRef.current.fillRect(startX,startY,endX - startX, endY - startY);
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.clearRect(0,0,width,height)
            previewContextRef.current.arc(startX, startY, endX-startX, 0, 2 * Math.PI);
            previewContextRef.current.fill();
        }
        else if (drawType === DrawTypes.Line){
            previewContextRef.current.clearRect(0,0,width,height)
            previewContextRef.current.beginPath();
            previewContextRef.current.moveTo(startX - bounds.left, startY- bounds.top);
            previewContextRef.current.lineTo(endX,endY);
            previewContextRef.current.stroke();
        }
        else if (drawType === DrawTypes.Arrow){
            previewContextRef.current.clearRect(0,0,width,height)
            previewContextRef.current.beginPath();
            previewContextRef.current.moveTo(startX - bounds.left, startY- bounds.top);
            previewContextRef.current.lineTo(endX,endY);

            let vec = Vector(startX-endX, startY - endY);
            let vecLeft = rotateVector(vec,degToRad(arrowAngle));
            let vecRight = rotateVector(vec,-degToRad(arrowAngle));

            let vecEndLeft = addVector(Vector(endX,endY),changeVectorLenght(vecLeft, 50))
            let vecEndRight = addVector(Vector(endX,endY),changeVectorLenght(vecRight,50))

            previewContextRef.current.moveTo(endX - bounds.left, endY- bounds.top);
            previewContextRef.current.lineTo(vecEndLeft.x,vecEndLeft.y);
            previewContextRef.current.moveTo(endX - bounds.left, endY- bounds.top);
            previewContextRef.current.lineTo(vecEndRight.x, vecEndRight.y);

            previewContextRef.current.stroke();

        }
        // Makes a Shape moveable
        else if (drawType === DrawTypes.None && selectedShape !== undefined){
            previewContextRef.current.clearRect(0,0,width,height)

            let dx = startX - params.clientX - bounds.left;
            let dy = startY - params.clientY - bounds.top;

            let imageData = previewContextRef.current.getImageData(0,0,width,height);
            let color = hexToRGB(selectedShape.FillColor);

            for (let i = 0; i < selectedShape.Pixels.length; i++) {
                let j = selectedShape.Pixels[i];
                let curX = getColIndex(j);
                let curY = getRowIndex(j);

                let newIndex = getDestinationArrayIndex(curY-dy, curX - dx);

                imageData.data[newIndex] = color.r;
                imageData.data[newIndex+1] = color.g;
                imageData.data[newIndex+2] = color.b;
                imageData.data[newIndex+3] = 255;
            }
            previewContextRef.current.putImageData(imageData,0,0)
        }
        params.preventDefault();
    }

    const scrollHandler = (params) => {
        contextRef.current.transform(1.2,0,0,1.2,0,0)
        indexContextRef.current.transform(1.2,0,0,1.2,0,0)

        redrawMainLayer()
        redrawIndexLayer()
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

    // Makes a Shape selection visible for the User
    const focusShape = (indexData, imageData,color) => {
        const data = imageData.data;
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
        let imageData = contextRef.current.getImageData(0,0,1500,1500);

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
        let imageData = indexContextRef.current.getImageData(0,0,1500,1500);

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

    // Returns the Pixel index from an Array index
    const getPixelIndex = (arrayIndex) =>{
        return arrayIndex / 4;
    }

    // Returns the row Number of a pixel in an Array
    const getRowIndex = (arrayIndex) =>{
        return parseInt(getPixelIndex(arrayIndex)/width)
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
        return getDestinationIndex(row,col) * 4 ;
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
                onScroll={scrollHandler}
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
    );
}

export default DrawingCanvas;