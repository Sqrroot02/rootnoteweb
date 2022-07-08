import "./IconButton.css"

const IconButton = ({icon, onClick, className}) =>{
    return(
        <button id="button-front" onClick={onClick} className="button-front">
            <img src={icon} className="button-icon" />
        </button>
    )
}

export default IconButton