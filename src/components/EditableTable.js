import {useEffect, useImperativeHandle, useRef, useState} from "react";
import uuid from "react-uuid";
import IconButton from "./IconButton";
import React from "react";
import "./EditableTable.css";

const EditableTable = React.forwardRef((props, ref) => {

    const [selectedRow,setSelectedRow] = useState(0)
    const [selectedColumn, setSelectedColumn] = useState(0)

    const [tableRows, setTableRows] = useState([])
    const [columnCount, setColumnCount] = useState(1)

    const [tableContent, setTableContent] = useState([])
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
        let columns = createColumns()
        let id = uuid()
        setTableRows(prev => [...prev,
            <tr id={id}>
                {columns}
            </tr>
        ])
    }

    function addColumn() {
        tableRows.map(x => {
            let id = uuid()
            console.log(x);
            x.props.children.push(
                <td contentEditable={true} id={id} key={id}  style={{height: 50, width: 100}} className="table-cell"></td>
            )
        })
        setTableRows(tableRows);
        setColumnCount(columnCount+1);
    }

    const createColumns = () =>{
        let columns = []
        for (let i = 0; i < columnCount; i++) {
            let id = uuid()
            columns.push(
                <td contentEditable={true} id={id} key={id}  style={{height: 50, width: 100}} className="table-cell"></td>
            )
        }
        return columns;
    }

    return(
        <div className="outer-table-container">
            <div className="options-container">
                <p className="table-title" contentEditable={true}/>
                <IconButton onClick={addRow}>
                    <img src="./icons/add-row-solid.svg"/>
                </IconButton>
                <IconButton onClick={addColumn}>
                    <img src="./icons/add-column-solid.svg"/>
                </IconButton>
            </div>
            <table key={uuid()} className="table-main">
                <tbody ref={bodyRef} id="table-body-root">
                    {tableRows}
                </tbody>
            </table>
        </div>
    )
})

export default EditableTable