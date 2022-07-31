import uuid from "react-uuid";
import IconButton from "../IconButton";
import "./LibraryTree.css"
import {useState} from "react";

const LibraryTree = () => {

    const [selectedLibrary, setSelectedLibrary] = useState(undefined)
    const [selectedSheet, setSelectedSheet] = useState(undefined)
    const [libraryStructure, setLibraryStructure] = useState([
        {
            name:"test",
            id:uuid(),
            color: "#000000",
            sheets: [],
        }
    ]);

    function addNewLibrary(){
        setLibraryStructure(
            libraryStructure.concat({
            name:"test",
            id:uuid(),
            color: "#000000",
            sheets: [{
                id:uuid(),
                title:"nameless",
                dateCreated: Date.now()
            }],
        }))
        console.log(libraryStructure)
    }

    function addNewSheet(){

        const elements = [...libraryStructure]

        const item = elements.find(x => x.id === selectedLibrary.id)
        item.sheets = item.sheets.concat({
            title:"nameless",
            id:uuid()
        })
        setLibraryStructure(elements)
        console.log(libraryStructure,item)
    }

    function newElementClicked(params){
        if (selectedLibrary === undefined){
            addNewLibrary()
        }
        else {
            addNewSheet()
        }
    }

    function selectedLibraryChanged(params){
        setSelectedLibrary(libraryStructure.find(x => x.id === params.target.id))
    }

    function selectedSheetChanged(params){
        setSelectedSheet(selectedLibrary.sheets.find(x => x.id === params.target.id))
    }

    const buildStructure = () => {

        if (selectedLibrary === undefined){
            return(
                libraryStructure.map((x,index) => {
                    return(
                        <div id={x.id} key={x.id} className="library-list-item" onClick={selectedLibraryChanged} style={{
                            backgroundColor: selectedLibrary === undefined? "#5b64e7" : selectedLibrary.id === x.id? "#6B64E7" : "#5b64e7"
                        }}>
                            <p id={x.id} className="library-list-item-tag">{x.name}</p>
                        </div>
                    )
                })
            )
        }
        else {
            return (
                selectedLibrary.sheets.map((x, index) => {
                    return(
                        <div id={x.id} key={x.id} className="library-list-item" onClick={selectedSheetChanged} style={{
                            backgroundColor: selectedSheet === undefined? "#5b64e7" : selectedSheet.id === x.id? "#6B64E7" : "#5b64e7"
                        }}>
                            <p id={x.id} className="library-list-item-tag">{x.title}</p>
                        </div>
                    )
                })
            )
        }

    }

    return(
        <div className="library-outer-border">
            <div className="library-list">
                <ul className="library-list-element" id={uuid()}>
                    {
                        buildStructure()
                    }
                </ul>
            </div>
            <div className="library-options">
                <IconButton className="library-options-add-button" onClick={newElementClicked}>
                    <img src="../icons/plus-solid.svg"/>
                </IconButton>
            </div>
        </div>
    )
}

export default LibraryTree