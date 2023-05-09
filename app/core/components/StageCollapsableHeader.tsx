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
        Stage {position+1} - {name}
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
  color: white;
  cursor: pointer;
  padding: .4em .8em;
  & > h2,
  h2 {
    margin: .5em 0;
  },
  button {
    color: white;
  }
`
