import styled from "@emotion/styled"
import IconButton from "@mui/material/IconButton"
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown"
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp"


interface IProps {
  name: string
  openedStage: number
  position: number
  setOpenedStage(arg1:any): void
}

function StageCollapsableHeader({ name, openedStage, position, setOpenedStage }: IProps) {
  return (
    <CollapsableHeader onClick={() => setOpenedStage(position === openedStage ? 0 : position)}>
      <h2>
        Stage {position} - {name}
      </h2>
      <IconButton
        aria-label="expand row"
        size="small"
        onClick={() => setOpenedStage(position === openedStage ? 0 : position)}
      >
        {position === openedStage ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
      </IconButton>
    </CollapsableHeader>
  )
}

export default StageCollapsableHeader

export const CollapsableHeader = styled.div`
  display: grid;
  grid-template-columns: auto min-content;
  align-items: center;
  background-color: #347ab7;
  border-radius: 4px;
  color: red;
  cursor: grab;
  padding: 10px 16px;
  & > h2,
  button {
    color: white;
  }
`
