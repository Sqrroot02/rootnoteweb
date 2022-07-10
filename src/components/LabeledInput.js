import "./LabeledInput.css"

const LabeledInput = ({className,title,inputClassName, onChange}) => {
    return(
        <div id="outer-container" className={className}>
            <label className="text-comp">{title}</label>
            <input onChange={onChange} id="input-comp" className={inputClassName}/>
        </div>
    )
}

export default LabeledInput;