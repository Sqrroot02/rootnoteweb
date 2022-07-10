import "./IconButton.css"

const IconButton = ({icon, onClick, text, className}) =>{
    return(
        <button id="button-front" onClick={onClick} className={className}>
            <div id="flexbox-container">
                <img src={icon} id="button-icon" />
            </div>
        </button>
    )
}

export default IconButton