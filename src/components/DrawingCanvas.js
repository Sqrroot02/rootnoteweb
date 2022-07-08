import React, {useEffect, useRef, useState} from "react";
import './DrawingCanvas.css'

const DrawingCanvas = ({strokeColor}) => {

    const [isMouseClicked, setMouseClicked] = useState(false);
    let isLoaded = false;

    const canvasRef = useRef(null);
    const contextRef = useRef(null);

    useEffect(() =>{
        if (contextRef.current === null){
            return;
        }
        contextRef.current.strokeStyle = strokeColor;
    },[strokeColor])

    useEffect(() =>{
        const canvas = canvasRef.current;
        canvas.width = 500;
        canvas.height = 500;

        const context = canvas.getContext("2d");
        contextRef.current = context;
        contextRef.current.lineCap = "round";
        contextRef.current.strokeStyle = strokeColor;
    },[])

    // Mouse Down Handler of the Canvas
    const mouseDownHandler = (params) =>{

        const bounds = canvasRef.current.getBoundingClientRect();

        contextRef.current.beginPath();
        contextRef.current.moveTo(params.clientX - bounds.left, params.clientY - bounds.top);
        contextRef.current.lineTo(params.clientX - bounds.left, params.clientY - bounds.top);
        contextRef.current.stroke();
        setMouseClicked(true);
        params.preventDefault();
    }

    // Mouse Up Handler of the Canvas
    const mouseUpHandler = (params) =>{
        setMouseClicked(false);
        contextRef.current.closePath();
    }

    // Mouse Move Handler of the Canvas
    const mouseMoveHandler = (params) =>{
        if (!isMouseClicked){
            return
        }
        const bounds = canvasRef.current.getBoundingClientRect();

        contextRef.current.lineTo(params.clientX - bounds.left, params.clientY - bounds.top);
        contextRef.current.stroke();
        params.preventDefault();
    }

    return(
        <canvas
            onMouseDown={mouseDownHandler}
            onMouseMove={mouseMoveHandler}
            onMouseUp={mouseUpHandler}
            ref={canvasRef}
            className="drawing-canvas"
        />
    );
}


export default DrawingCanvas;


