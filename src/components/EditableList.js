import {useRef, useState} from "react";
import "./EditableList.css"
import React from "react";
import CustomRadioButton from "./controls/RadioButton";
import uuid from "react-uuid";

const EditableList = (params) => {
    const [listElements, setListElements] = useState([
        {
            content: null,
            id: uuid()
        }
    ])
    const [listType, setListType] = useState("ul")
    const [selectedElement, setSelectedElement] = useState(null)
    const listId = uuid();

    function addListSubElement(id){
        const newId = id

        const elements = [...listElements];

        let index = listElements.findIndex(x => x.id === selectedElement)
        elements.splice(index,0,{content: null, id: newId})

        setListElements(elements)
    }

    function removeListSubElement(){

    }

    function focusOnListElement(params){
        setSelectedElement(params.target.id);
    }

    function keyboardListener(params){
        if (params.key === "Enter"){
            const newId = uuid()

            params.preventDefault()
            addListSubElement();
        }
        else {
            listElements.find(x => x.id === params.target.id).content = params.target.textContent
        }
    }

    function focusOnLoad(params){
        params.target.focus();
        console.log(params)
    }

    const buildList = () => {
        if (listType === "ul"){
            return(
                <ul id={listId}>
                    {
                        listElements.map(x =>
                            <li className="list-element" onKeyDown={keyboardListener} onFocus={focusOnListElement} contentEditable={true} id={x.id}>
                                {x.content}
                            </li>
                        )
                    }
                </ul>
            )
        }
        else if (listType === "ol") {
            return (
                <ol id={listId}>
                    {
                        listElements.map(x =>
                            <li className="list-element" onKeyDown={keyboardListener} onFocus={focusOnListElement} contentEditable={true} id={x.id}>
                                {x.content}
                            </li>
                        )
                    }
                </ol>
            )
        }
    }

    function onTypeChanged(params){
        setListType(params.target.value)
    }

    return(
        <div className="outer-table-container">
            <div className="options-container">
                <form style={{display:"flex", flexDirection:"row", margin:5}}>
                    <input placeholder="Enter a title..." className="table-title" contentEditable={true}/>
                    <div className="list-type-selection">
                        <CustomRadioButton onInput={onTypeChanged} value="ul" id="ul" width={15} height={15} name={listId}/>
                        <label style={{fontSize:15, marginLeft:10, marginBottom:8}}>Disordered List</label>
                        <CustomRadioButton onInput={onTypeChanged} value="ol" id="ol" width={15} height={15} name={listId}/>
                        <label style={{fontSize:15, marginLeft:10, marginBottom:8}}>Ordered List</label>
                    </div>
                </form>
            </div>
            <div>
                {buildList()}
            </div>
        </div>
    )
}

export default EditableList