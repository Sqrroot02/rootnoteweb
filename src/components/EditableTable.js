import {useEffect, useImperativeHandle, useRef, useState} from "react";
import uuid from "react-uuid";
import IconButton from "./IconButton";
import React from "react";
import "./EditableTable.css";

const EditableTable = React.forwardRef(({removeTable}, ref) => {

    const [tableRows, setTableRows] = useState([
        {
            id:uuid(),
            columns:[
                {
                    id:uuid(),
                    className:"table-cell",
                    content:null
                },
                {
                    id:uuid(),
                    className:"table-cell",
                    content:null
                }
            ]
        },
        {
            id:uuid(),
            columns:[
                {
                    id:uuid(),
                    className:"table-cell",
                    content:null
                },
                {
                    id:uuid(),
                    className:"table-cell",
                    content:null
                }
            ]
        }
    ])
    const [columnCount, setColumnCount] = useState(1)
    let selectedCell = {row:null,col:null}

    const bodyRef = useRef()

    useImperativeHandle(ref,() =>({
        addColumn(){
            addColumn()
        },
        addRow(){
            addRow()
        },
        removeColumn(){
            remColumn()
        },
        removeRow(){
            remRow()
        }
    }))

    function addRow() {
        let id = uuid()
        setTableRows(prev => [...prev,
            {
                id:uuid(),
                columns: createColumns()
            }
        ])
    }

    // Removes a Row from the Context Table
    function remRow(){
        let index = tableRows.findIndex(x => x.id === selectedCell.row)

        const elements = [...tableRows]
        elements.splice(index,1)

        setTableRows(elements)
    }

    // Appends a row to the Context Table
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
        setColumnCount(columnCount+1);
    }

    // Removes a Column from the Context Table
    function remColumn(){
        const rows = [...tableRows]

        let index = tableRows[tableRows.findIndex(x => x.id === selectedCell.row)].columns.findIndex(x => x.id === selectedCell.col)
        for (let i = 0; i < tableRows.length; i++) {
            const elements = [...rows[i].columns]
            elements.splice(index,1)
            rows[i].columns = elements;
        }
        setTableRows(rows)
        setColumnCount(columnCount-1)
    }

    // Creates a new Column for a new Row
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

    // Saves input Data of a cell on input changed
    const oninputChanged = (params) => {
        const rowId = params.target.parentElement.id;
        const colId = params.target.id;

        tableRows.find(x => x.id === rowId).columns.find(y => y.id === colId).content = params.target.textContent;

        console.log(params)
    }

    // Saves the current selected cell
    function onCellSelected(params){
        const rowId = params.target.parentElement.id;
        const colId = params.target.id;

        selectedCell = {row:rowId,col:colId};
    }

    return(
        <div className="outer-table-container">
            <div className="options-container">
                <input placeholder="Enter a title..." className="table-title" contentEditable={true}/>
                <div className="hidden-table-options">
                    <IconButton onClick={addRow}>
                        <img src="./icons/add-row-solid.svg"/>
                    </IconButton>
                    <IconButton onClick={addColumn}>
                        <img src="./icons/add-column-solid.svg"/>
                    </IconButton>
                    <IconButton onClick={remRow}>
                        <img src="./icons/rem-row-solid.svg"/>
                    </IconButton>
                    <IconButton onClick={remColumn}>
                        <img src="./icons/rem-column-solid.svg"/>
                    </IconButton>
                    <IconButton onClick={removeTable}>
                        <img src="./icons/circle-minus-solid.svg"/>
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
                                        <td onFocus={onCellSelected} onInput={oninputChanged} id={y.id} className={y.className} contentEditable={true}>
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