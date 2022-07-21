import {useEffect, useImperativeHandle, useRef, useState} from "react";
import uuid from "react-uuid";
import IconButton from "./IconButton";
import React from "react";
import "./EditableTable.css";

const EditableTable = React.forwardRef((props, ref) => {

    const [selectedRow,setSelectedRow] = useState(0)
    const [selectedColumn, setSelectedColumn] = useState(0)

    const [tableRows, setTableRows] = useState([
        {
            id:uuid(),
            columns:[
                {
                    id:uuid(),
                    className:"table-cell",
                    content:null
                }
            ]
        }
    ])
    const [columnCount, setColumnCount] = useState(1)

    const [tableContent, setTableContent] = useState()
    const [selectedCell, setSelectedCell] = useState(null)

    const bodyRef = useRef()

    useImperativeHandle(ref,() =>({
        addColumn(){
            addColumn()
        },
        addRow(){
            addRow()
        },
        removeColumn(){

        },
        removeRow(){

        }
    }))

    function addRow() {
        console.log(tableRows)
        let id = uuid()
        setTableRows(prev => [...prev,
            {
                id:uuid(),
                columns: createColumns()
            }
        ])
    }

    function addColumn() {
        tableRows.map(x => {
            x.columns.push(
                {
                    id:uuid(),
                    className:"table-cell",
                    content:null
                }
            )
        })
        //setTableRows(tableRows);
        setColumnCount(columnCount+1);
    }

    const createColumns = () =>{
        let columns = []
        for (let i = 0; i < columnCount; i++) {
            columns.push(
                {
                    id:uuid(),
                    className:"table-cell",
                    content:null
                }
            )
        }
        return columns;
    }

    const oninputChanged = (params) => {
        const rowId = params.target.parentElement.id;
        const colId = params.target.id;

        tableRows.find(x => x.id === rowId).columns.find(y => y.id === colId).content = params.target.textContent;

        console.log(params)
    }

    return(
        <div className="outer-table-container">
            <div className="options-container">
                <input className="table-title" contentEditable={true}/>
                <div className="hidden-table-options">
                    <IconButton onClick={addRow}>
                        <img src="./icons/add-row-solid.svg"/>
                    </IconButton>
                    <IconButton onClick={addColumn}>
                        <img src="./icons/add-column-solid.svg"/>
                    </IconButton>
                </div>
            </div>
            <table key={uuid()} className="table-main">
                <tbody ref={bodyRef} id="table-body-root">
                    {
                        tableRows.map(x => (
                            <tr id={x.id}>
                                {
                                    x.columns.map(y => (
                                        <td onInput={oninputChanged} id={y.id} className={y.className} contentEditable={true}>
                                            {y.content}
                                        </td>
                                    ))
                                }
                            </tr>
                        ))
                    }
                </tbody>
            </table>
        </div>
    )
})

export default EditableTable