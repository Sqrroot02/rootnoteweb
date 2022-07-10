import {Button, Col, Container, Row} from 'react-bootstrap';
import IconButton from "../IconButton";
import "./DrawTypeDropDown.css"
import {useEffect, useState} from "react";
import DrawTypes from "../enums/DrawTypes";
import drawTypes from "../enums/DrawTypes";

const DrawTypeDropDown = ({isOpen, onSelectionChanged}) => {

    const [opacity, setOpacity] = useState(0);
    const [open, setOpen] = useState("visible");

    useEffect(() =>{
        if (open === "collapse"){
            setOpen("visible");
            setOpacity(1);
            console.log("xxx")
        }
        else {
            setOpen("collapse")
            setOpacity(0);
        }

    },[isOpen])


    function onMouseLeave() {
        setOpen("collapse")
        setOpacity(0);
        isOpen = false
    }

    function onSelect(drawType){
        onSelectionChanged(drawType)
        setOpen("collapse")
        setOpacity(0);
        isOpen = false
    }

  return(
      <div className="popup-box" style={{visibility: open, opacity: opacity }} onMouseLeave={onMouseLeave}>
        <div className="box">
            <div className="row-one">
                <IconButton className="row" icon="./icons/pen-solid.svg" onClick={event => onSelect(DrawTypes.Free)}/>
                <IconButton className="row" icon="./icons/hand-solid.svg" onClick={event => onSelect(DrawTypes.None)}/>
            </div>
            <div className="row-two">
                <IconButton className="row" icon="./icons/circle-regular.svg" onClick={event => onSelect(DrawTypes.Circle)}/>
                <IconButton className="row" icon="./icons/square-regular.svg" onClick={event => onSelect(DrawTypes.Rectangle)}/>
            </div>
        </div>
      </div>
  )
}

export default DrawTypeDropDown