import {useImperativeHandle, useRef} from "react";
import uuid from "react-uuid";

const EditableTable = React.forwardRef((props, ref) => {

    const [selectedRow,setSelectedRow] = useRef(0)
    const [selectedColumn, setSelectedColumn] = useRef(0)

    const [tableRows, setTableRows] = useRef(undefined)

    useImperativeHandle(ref,() =>({
        addColumn(){

        },
        addRow(){

        },
        removeColumn(){

        },
        removeRow(){

        }
    }))


})