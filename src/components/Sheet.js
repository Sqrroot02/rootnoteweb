import {createRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import uuid from "react-uuid"
import DrawingCanvas from "./DrawingCanvas";
import React from "react";
import "./Sheet.css"
import "./EditableTable";
import EditableTable from "./EditableTable";
import EditableList from "./EditableList";

const Sheet = React.forwardRef(({drawSize, drawColor, drawType},ref) => {

    const [items,setItems] = useState([{type: "DrawingCanvas",key: uuid(),ref: createRef()}]);

    useEffect(() =>{

    },[items])

    useImperativeHandle(ref, () =>({
        // Adds a new Paragraph to components array
        addParagraph(){
            setItems(current => [...current,
                {type: "p", className: "paragraph", style: {width:1000}, contentEditable:true, key: uuid(), content:"test", ref:createRef()}
            ])
        },
        addCanvas(){
            setItems(current => [...current,
                {
                    type: "DrawingCanvas",
                    key: uuid(),
                    ref:createRef()
                }])
        },
        addTable(){
            setItems(current => [...current,
                {
                    type: "EditableTable",
                    key: uuid(),
                    ref: createRef()
                }])
        },
        addList(){
            setItems(current => [...current,
                {
                    type: "EditableList",
                    key: uuid(),
                    ref: createRef()
                }])
        }
    }))

    function onSheetChanged() {
        //getSheetJSON()
    }

    function getSheetJSON(){
        let result = []

        items.map(x => {
            result.push({
                type: x.type,
                key:x.key,
                data: x.ref.current.getData()
            })
        })
        let json = JSON.stringify(result);
    }

    const components = items.map((x) =>{
        // Appends new DrawingCanvas to DOM
        if (x.type === "DrawingCanvas"){
            return(
                <div key={x.key}>
                    <DrawingCanvas onChange={onSheetChanged} ref={x.ref} canvasWidth={700} canvasHeight={700} drawType={drawType} drawSize={drawSize} strokeColor={drawColor}/>
                </div>
            )
        }
        // Appends a new Table to DOM
        else if (x.type === "EditableTable"){
            return (
                <div key={x.key}>
                    <EditableTable onChange={onSheetChanged} ref={x.ref}/>
                </div>
            )
        }
        // Appends a new List to DOM
        else if (x.type === "EditableList"){
            return (
                <div key={x.key}>
                    <EditableList onChange={onSheetChanged} ref={x.ref}/>
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
        <div className="sheet-border">
            {components}
        </div>
    )
})

export default Sheet