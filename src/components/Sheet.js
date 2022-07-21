import {useImperativeHandle, useRef, useState} from "react";
import uuid from "react-uuid"
import DrawingCanvas from "./DrawingCanvas";
import React from "react";
import "./Sheet.css"
import "./EditableTable";
import EditableTable from "./EditableTable";

const Sheet = React.forwardRef(({drawSize, drawColor, drawType},ref) => {

    const [items,setItems] = useState([{type: "DrawingCanvas",key: uuid()}]);


    useImperativeHandle(ref, () =>({
        // Adds a new Paragraph to components array
        addParagraph(){
            setItems(current => [...current,
                {type: "p", className: "paragraph", style: {width:1000}, contentEditable:true, key: uuid(), content:"test"}
            ])
        },
        addCanvas(){
            setItems(current => [...current,
                {
                    type: "DrawingCanvas",
                    key: uuid(),
                }])
        },
        addTable(){
            setItems(current => [...current,
                {
                    type: "EditableTable",
                    key: uuid(),
                }])
        }
    }))

    const components = items.map((x) =>{
        // Appends new DrawingCanvas to DOM
        if (x.type === "DrawingCanvas"){
            return(
                <div key={x.key}>
                    <DrawingCanvas canvasWidth={500} canvasHeight={500} drawType={drawType} drawSize={drawSize} strokeColor={drawColor}/>
                </div>
            )
        }
        else if (x.type === "EditableTable"){
            return (
                <div key={x.key}>
                    <EditableTable ref={null}/>
                </div>
            )
        }
        else {
            return(
                React.createElement(x.type,{
                    style: x.style,
                    key: x.key,
                    contentEditable: x.contentEditable,
                    className: x.className
                },null)
            )
        }
    })

    return(
        <div>
            {components}
        </div>
    )
})

export default Sheet