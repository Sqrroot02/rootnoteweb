import {useState} from "react";
import "./EditableList.css"
import React from "react";

const EditableList = (params) => {
    const [listElements, setListElements] = useState()

    const [listType, setListType] = useState("ul")

    return(
        <div className="outer-table-container">
            <div className="options-container">
                <form>
                    <input placeholder="Enter a title..." className="table-title" contentEditable={true}/>
                    <div className="radio-box">
                        <input className="radio-input" name="listKind" type={"radio"} id="uList" value="ul"/>
                        <div className="radio-fake"/>
                        <label className="radio-label" htmlFor="uList">Unordnered List</label>
                    </div>
                    <div className="radio-box">
                        <input className="radio-input" name="listKind" type={"radio"} id="oList" value="ol"/>
                        <div className="radio-fake"/>
                        <label className="radio-label" htmlFor="oList">Ordnered List</label>
                    </div>
                </form>
            </div>
        </div>
    )
}

export default EditableList