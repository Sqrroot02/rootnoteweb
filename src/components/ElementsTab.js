import IconButton from "./IconButton";

const ElementsTab = ({setDrawCanvas,setParagraph,setTable,setList}) => {
  return (
      <div className="outer-container">
          <IconButton className="tool-button" onClick={setDrawCanvas}>
              <img src="./icons/pen-solid.svg"/>
          </IconButton>
          <IconButton className="tool-button" onClick={setParagraph}>
              <img src="./icons/text-solid.svg"/>
          </IconButton>
          <IconButton className="tool-button" onClick={setTable}>
              <img src="./icons/table-solid.svg"/>
          </IconButton>
          <IconButton className="tool-button" onClick={setList}>
              <img src="./icons/list-solid.svg"/>
          </IconButton>
      </div>
  )
}

export default ElementsTab