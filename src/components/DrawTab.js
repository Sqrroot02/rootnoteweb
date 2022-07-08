import "./DrawTab.css"
import IconButton from "./IconButton";

const DrawTab = ({setSelectedColor}) => {
    let state = false;

    function onClick() {
        if (state === false){
            setSelectedColor("#4287f5");
            state = true;
        }
        else{
            setSelectedColor("#000000");
            state = false;

        }
    }

    return(
        <div className="outer-container">
            <IconButton className="tool-button" icon="./icons/pen-solid.svg" onClick={onClick}/>
            <IconButton className="tool-button" icon="./icons/shapes-solid.svg" />
        </div>
    )
}

export default DrawTab
