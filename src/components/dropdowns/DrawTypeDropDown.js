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
            <div className="seperator-box">
                <p className="seperator-title">Tools</p>
            </div>
            <div className="row-one">
                <IconButton className="row" onClick={event => onSelect(DrawTypes.Free)}>
                    <img src="./icons/pen-solid.svg"/>
                </IconButton>
                <IconButton className="row" icon="./icons/hand-solid.svg" onClick={event => onSelect(DrawTypes.None)}>
                    <img src="./icons/hand-solid.svg"/>
                </IconButton>
            </div>
            <div className="seperator-box">
                <p className="seperator-title">Shapes</p>
            </div>
            <div className="row-two">
                <IconButton className="row" onClick={event => onSelect(DrawTypes.Circle)}>
                    <img src="./icons/circle-regular.svg"/>
                </IconButton>
                <IconButton className="row" onClick={event => onSelect(DrawTypes.Rectangle)}>
                    <img src="./icons/square-regular.svg"/>
                </IconButton>
            </div>
            <div className="seperator-box">
                <p className="seperator-title">Lines</p>
            </div>
            <div className="row-three">
                <IconButton className="row" onClick={event => onSelect(DrawTypes.Line)}>
                    <img src="./icons/slash-solid.svg"/>
                </IconButton>
                <IconButton className="row" onClick={event => onSelect(DrawTypes.Arrow)}>
                    <img src="./icons/right-long-solid.svg"/>
                </IconButton>
            </div>
        </div>
      </div>
  )
}

export default DrawTypeDropDown