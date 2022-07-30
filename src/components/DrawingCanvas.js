import React, {useEffect, useImperativeHandle, useRef, useState} from "react";
import './DrawingCanvas.css'
import DrawTypes from "./enums/DrawTypes";
import {Arrow, Circle, Rectangle, Shape, Triangle,Path} from "./models/Shapes";
import {hexToRgb, rgbToHex} from "./helpers/NumberConversion";
import "./helpers/Graphics";
import {
    DrawArrow,
    DrawCircle,
    DrawLine, DrawPath,
    DrawRectangle, DrawTriangle, FillPixels, getBorderPixels,
    getColIndex,
    getDestinationArrayIndex, getFilledPixels,
    getRowIndex
} from "./helpers/Graphics";
import {getLenght} from "./helpers/VectorHelper";
import Vector from "./helpers/Vector";

const DrawingCanvas = React.forwardRef((
    {strokeColor,
        drawType,
        drawSize,
        selectedShapeChanged,
        canvasWidth,
        canvasHeight,
        key,
        onChange},refThis) => {


    const [isMouseClicked, setMouseClicked] = useState(false); // Save current Mouse Click behavior

    const [startX, setStartX] = useState(0); // Start X
    const [startY, setStartY] = useState(0) // Start Y

    const [scrollPosX, setScrollPosX] = useState(0);
    const [scrollPosY, setScrollPosY] = useState(0)

    const [width, setWidth] = useState(800);
    const [height, setHeight] = useState(800);

    const [colorIndex, setColorIndex] = useState(256);  // Current shape Index
    const [selectedShape, setSelectedShape] = useState(Shape());   // Current selected Shapes
    const [previewShape, setPreviewShape] = useState(Shape());
    const [shapes, setShapes] = useState([]); // Shapes Collection

    const [loaded, setLoaded] = useState(false) // Indicates weather the Object has been loaded for the first time for init

    const canvasRef = useRef(null); // first-Layer canvas
    const contextRef = useRef(null);

    const previewCanvasRef = useRef(null); // secound-Layer canvas
    const previewContextRef = useRef(null);

    const indexCanvasRef = useRef(null); // third-Layer canvas
    const indexContextRef = useRef(null);

    const [oldCanvasWidth, setOldCanvasWidth] = useState(width);
    const [currentShape, setCurrentShape] = useState(null)

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

    useImperativeHandle(refThis,() =>({
        getData(){
            let result = []

            shapes.map(x => {
                result.push(
                    {
                        data:x.Data,
                        stroke:x.StrokeColor,
                        fill:x.FillColor,
                        id:x.ColorId,
                        name:x.Name,
                    }
                )
            })
            return result;
        }
    }))


    // init Effect
    useEffect(() =>{
        applySettings()

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

            setCurrentShape(Path([]))
        }
        else if (drawType === DrawTypes.Rectangle){
            previewContextRef.current.moveTo(pos.x, pos.y);
            setCurrentShape(Rectangle(pos.x,pos.y,pos.x,pos.y))
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.moveTo(pos.x, pos.y);
            setCurrentShape(Circle(pos.x,pos.y,pos.x,pos.y))

            previewContextRef.current.beginPath();
        }
        else if (drawType === DrawTypes.Line){
            previewContextRef.current.moveTo(pos.x, pos.y);
            setCurrentShape(Rectangle(pos.x,pos.y,pos.x,pos.y))
        }
        else if (drawType === DrawTypes.Arrow){
            previewContextRef.current.moveTo(pos.x, pos.y);
            setCurrentShape(Arrow(pos.x,pos.y,pos.x,pos.y,arrowAngle))
        }
        else if (drawType === DrawTypes.Triangle){
            previewContextRef.current.moveTo(pos.x, pos.y);
            setCurrentShape(Triangle(pos.x,pos.y,pos.x,pos.y))
        }
        else if (drawType === DrawTypes.None){
            let pixelData = indexContextRef.current.getImageData(pos.x, pos.y,1,1).data;
            let color = [pixelData[0], pixelData[1], pixelData[2], pixelData[3]];

            let s = shapes.find(x => x.ColorId.r === color[0] && x.ColorId.g === color[1] && x.ColorId.b === color[2]);
            setSelectedShape(s);
            setCurrentShape(s.Data)
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
            DrawLine(contextRef,startX,startY,endX,endY)
            DrawLine(indexContextRef,startX,startY,endX,endY)
        }
        else if (drawType === DrawTypes.Arrow){
            DrawArrow(contextRef,startX,startY,endX,endY,arrowAngle,50)
            DrawArrow(indexContextRef,startX,startY,endX,endY,arrowAngle,50)
        }
        else if (drawType === DrawTypes.Triangle){
            DrawTriangle(contextRef,startX,startY,endX,endY);
            DrawTriangle(indexContextRef,startX,startY,endX,endY);
        }
        else if (drawType === DrawTypes.None && selectedShape !== undefined){
            let dx = startX - pos.x;
            let dy = startY - pos.y;

            if (selectedShape.Type === DrawTypes.Free){
                selectedShape.Data.Endpoints.map(x => {
                    x.x = x.x - dx;
                    x.y = x.y - dy;
                })
            }

            selectedShape.Data.StartX = selectedShape.Data.StartX - dx
            selectedShape.Data.StartY = selectedShape.Data.StartY - dy
            selectedShape.Data.EndX = selectedShape.Data.EndX - dx
            selectedShape.Data.EndY = selectedShape.Data.EndY - dy

            redrawMainLayer();
            redrawIndexLayer();
        }

        if (drawType !== DrawTypes.None){
            let colorString = "#"+((colorIndex)>>>0).toString(16).slice(-6);
            colorString = colorString[1] + colorString[1] +colorString[2] + colorString[2] + colorString[3] + colorString[3];

            let rgb = hexToRGB(colorString);
            let selected = getFilledPixels(previewContextRef.current.getImageData(0, 0,width,height).data)

            shapes.push(Shape(rgb,contextRef.current.strokeStyle,contextRef.current.strokeStyle,selected,currentShape,drawSize,drawType))
            setColorIndex(colorIndex+1);
        }
        previewContextRef.current.clearRect(0,0,width,height)
        onChange();
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

            currentShape.Endpoints.push({x:endX,y:endY})
        }
        else if (drawType === DrawTypes.Rectangle){
            previewContextRef.current.clearRect(0,0,width,height)
            currentShape.EndX = endX;
            currentShape.EndY = endY;
            DrawRectangle(previewContextRef,startX,startY,endX,endY);
        }
        else if (drawType === DrawTypes.Circle){
            previewContextRef.current.clearRect(0,0,width,height)
            currentShape.EndX = endX;
            currentShape.EndY = endY;
            DrawCircle(previewContextRef,startX,startY,getLenght(Vector(endX-startX,endY-startY)))
        }
        else if (drawType === DrawTypes.Line){
            previewContextRef.current.clearRect(0,0,width,height)
            currentShape.EndX = endX;
            currentShape.EndY = endY;
            DrawLine(previewContextRef,startX - bounds.left,startY - bounds.top,endX,endY)
        }
        else if (drawType === DrawTypes.Arrow){
            previewContextRef.current.clearRect(0,0,width,height)
            currentShape.EndX = endX;
            currentShape.EndY = endY;
            DrawArrow(previewContextRef,startX - bounds.left,startY-bounds.top,endX,endY,arrowAngle,50)
        }
        else if (drawType === DrawTypes.Triangle){
            previewContextRef.current.clearRect(0,0,width,height)
            currentShape.EndX = endX;
            currentShape.EndY = endY;
            DrawTriangle(previewContextRef,startX- bounds.left,startY-bounds.top,endX,endY);
        }
        // Makes a Shapes movable
        else if (drawType === DrawTypes.None && selectedShape !== undefined){
            previewContextRef.current.clearRect(0,0,width,height)

            let dx = startX - pos.x;
            let dy = startY - pos.y;
            let preview = structuredClone(selectedShape)

            if (selectedShape.Type === DrawTypes.Free){
                for (let i = 0; i < preview.Data.Endpoints.length; i++) {
                    preview.Data.Endpoints[i].x = selectedShape.Data.Endpoints[i].x - dx
                    preview.Data.Endpoints[i].y = selectedShape.Data.Endpoints[i].y - dy
                }
            }
            else {
                preview.Data.StartX = selectedShape.Data.StartX -dx;
                preview.Data.EndX = selectedShape.Data.EndX -dx;
                preview.Data.StartY = selectedShape.Data.StartY -dy;
                preview.Data.EndY = selectedShape.Data.EndY -dy;
            }

            previewContextRef.current.strokeStyle = "#5b64e7";
            previewContextRef.current.fillStyle = "#5b64e7";

            setPreviewShape(preview);

            draw(previewContextRef,preview)

            previewContextRef.current.strokeStyle = strokeColor;
            previewContextRef.current.fillStyle = strokeColor;
        }
        params.preventDefault();
    }


    // Redraws the Main-Interaction Layer
    function redrawMainLayer(){
        contextRef.current.clearRect(0,0,width,height)
        redraw(contextRef,false)
    }

    // Redraws the Index Layer
    function redrawIndexLayer(){
        indexContextRef.current.clearRect(0,0,width,height)
        redraw(indexContextRef,true)
    }

    function draw(canContext,shape){
        if (shape.Type === DrawTypes.Line){
            DrawLine(canContext,shape.Data.StartX,shape.Data.StartY,shape.Data.EndX,shape.Data.EndY)
        }
        else if (shape.Type === DrawTypes.Arrow){
            DrawArrow(canContext,shape.Data.StartX,shape.Data.StartY,shape.Data.EndX,shape.Data.EndY,shape.Data.Angle,50)
        }
        else if (shape.Type === DrawTypes.Rectangle){
            DrawRectangle(canContext,shape.Data.StartX,shape.Data.StartY,shape.Data.EndX,shape.Data.EndY)
        }
        else if (shape.Type === DrawTypes.Triangle){
            DrawTriangle(canContext,shape.Data.StartX,shape.Data.StartY,shape.Data.EndX,shape.Data.EndY)
        }
        else if (shape.Type === DrawTypes.Circle){
            DrawCircle(canContext,shape.Data.StartX,shape.Data.StartY,getLenght(Vector(shape.Data.EndX-shape.Data.StartX,shape.Data.EndY-shape.Data.StartY)))
        }
        else if (shape.Type === DrawTypes.Free){
            DrawPath(canContext,shape.Data.Endpoints)
        }
    }

    function redraw(canContext,isIndex){
        shapes.map(x => {
            canContext.current.fillStyle = x.FillColor
            canContext.current.strokeStyle = x.StrokeColor;
            if (isIndex){
                canContext.current.fillStyle = rgbToHex(x.ColorId.r,x.ColorId.g,x.ColorId.b);
                canContext.current.strokeStyle = rgbToHex(x.ColorId.r,x.ColorId.g,x.ColorId.b);
            }
            canContext.current.lineCap = "round";
            canContext.current.lineJoin = "round"
            canContext.current.lineWidth = x.StrokeWidth;
            canContext.current.imageSmoothingEnabled = true;

            draw(canContext,x)
        })
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
        let bounds = params.target.getBoundingClientRect();

        const boundX = params.clientX || params.touches[0].clientX
        const boundY = params.clientY || params.touches[0].clientY

        const x = boundX - params.target.offsetLeft - bounds.left
        const y = boundY - params.target.offsetTop + window.scrollY - bounds.top

        return{x, y}
    }


    function thumbBottomDragMove(params){
        if (params.clientY !== 0){
            setHeight(params.clientY - canvasRef.current.getBoundingClientRect().top)

            const canvas = canvasRef.current;
            canvas.height = height;

            const prevCanvas = previewCanvasRef.current;
            prevCanvas.height = height;

            const inCanavas = indexCanvasRef.current;
            inCanavas.height = height;
        }
    }

    function thumbRightDragMove(params) {
        if (params.clientX !== 0){
            setWidth(params.clientX - canvasRef.current.getBoundingClientRect().left)

            const canvas = canvasRef.current;
            canvas.width = width;

            const prevCanvas = previewCanvasRef.current;
            prevCanvas.width = width;

            const inCanvas = indexCanvasRef.current;
            inCanvas.width = width;
        }
    }

    function thumbRightDragEnd(params){
        applySettings()
        redrawMainLayer()
        redrawIndexLayer()
    }

    function thumbBottomDragEnd(params){
        applySettings()
        redrawMainLayer()
        redrawIndexLayer()
    }

    // Thumb Right Start
    function thumbRightDragStart(params){
        setOldCanvasWidth(width)
    }


    // General Settings for all Canvas Elements
    function applySettings(){
        const canvas = canvasRef.current;
        canvas.width = width;
        canvas.height = height;

        const context = canvas.getContext("2d");
        contextRef.current = context;
        contextRef.current.lineCap = "round";
        contextRef.current.lineJoin = "round"
        contextRef.current.strokeStyle = strokeColor;
        contextRef.current.fillStyle = strokeColor;
        contextRef.current.lineWidth = drawSize;

        const prevCanvas = previewCanvasRef.current;
        prevCanvas.width = width;
        prevCanvas.height = height;

        const prevContext = prevCanvas.getContext("2d");
        previewContextRef.current = prevContext;
        previewContextRef.current.lineCap = "round";
        previewContextRef.current.lineJoin = "round"
        previewContextRef.current.strokeStyle = strokeColor;
        previewContextRef.current.fillStyle = strokeColor;
        previewContextRef.current.lineWidth = drawSize;

        const inCanavas = indexCanvasRef.current;
        inCanavas.width = width;
        inCanavas.height = height;

        const inContext = inCanavas.getContext("2d");
        indexContextRef.current = inContext;
        indexContextRef.current.lineWidth = drawSize;
        indexContextRef.current.lineCap = "round";
        indexContextRef.current.lineJoin = "round"
    }

    // Layout return
    return(
        <div style={{display: "flex", flexDirection:"column", height:height + 20, width:width + 20, position:"relative"}}>
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
               <div onTouchStart={thumbRightDragStart} onTouchMove={thumbRightDragMove} onDragEnd={thumbRightDragEnd} onDragStart={thumbRightDragStart} draggable={true} className="thumb-right" onDrag={thumbRightDragMove} style={{width:20}}/>
           </div>
            <div onDragEnd={thumbBottomDragEnd} draggable={true} className="thumb-bottom" onDrag={thumbBottomDragMove} style={{height:10}}/>
        </div>
    );
})

export default DrawingCanvas;