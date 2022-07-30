import uuid from "react-uuid";
import IconButton from "../IconButton";
import "./LibraryTree.css"
import {useState} from "react";

const LibraryTree = () => {

    const [selectedLibrary, setSelectedLibrary] = useState(null)
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
            sheets: [],
        }))
        console.log(libraryStructure)
    }

    return(
        <div className="library-outer-border">
            <div className="library-list">
                <ul className="library-list-element" id={uuid()}>
                    {
                        libraryStructure.map((x,index) => {
                            return(
                                <div key={index} className="library-list-item">{x.name}</div>
                            )
                        })
                    }
                </ul>
            </div>
            <div className="library-options">
                <IconButton className="library-options-add-button" onClick={addNewLibrary}>
                    <img src="../icons/plus-solid.svg"/>
                </IconButton>
            </div>
        </div>
    )
}

export default LibraryTree