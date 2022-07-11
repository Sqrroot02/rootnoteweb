import "./IconButton.css"

const IconButton = ({icon, onClick, text, className, children}) =>{
    return(
        <button id="button-front" onClick={onClick} className={className}>
            <div id="flexbox-container">
                {children}
            </div>
        </button>
    )
}

export default IconButton