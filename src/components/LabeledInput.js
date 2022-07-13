import "./LabeledInput.css"

const LabeledInput = ({className,title,inputClassName, onChange,type,text,min,max}) => {
    return(
        <div id="outer-container" className={className}>
            <label className="text-comp">{title}</label>
            <input min={min} max={max} type={type} name="input-Comp" placeholder={text} onChange={onChange} id="input-comp" className={inputClassName}/>
        </div>
    )
}

export default LabeledInput;