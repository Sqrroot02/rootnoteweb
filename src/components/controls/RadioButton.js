import "./RadioButton.css"

const CustomRadioButton = ({onInput,name,height,width,id,value}) => {
    return(
        <div className="radio-button-container" style={{height:height,width:width}}>
            <input onInput={onInput} value={value} type="radio" className="radio-default" id={id} name={name} style={{height:height,width:width}}/>
            <span className="radio-button-dot" style={{height:height,width:width}}/>
        </div>
    )
}

export default CustomRadioButton