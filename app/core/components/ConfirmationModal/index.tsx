import React from "react"
import ModalBox from "../../components/ModalBox"
import { Button } from "@mui/material"
import styled from "@emotion/styled"

interface IProps {
  children: React.ReactNode
  open: boolean
  handleClose: React.MouseEventHandler
  close: Function
  label: string
  onClick: React.MouseEventHandler
  disabled?: boolean | false
  className?: string | ""
}

export const Action = styled.div`
  display: flex;
  justify-content: flex-end;
`

export const ConfirmationModal = ({ children, ...props }: IProps) => {
  return (
    <ModalBox open={props.open} close={props.close} handleClose={props.handleClose}>
      {children}
      <br />
      <Action>
        <Button className="primary default" onClick={props.handleClose}>
          Cancel
        </Button>
        &nbsp;
        <Button
          className={`primary ${props.className}`}
          disabled={props.disabled}
          onClick={props.onClick}
        >
          {props.label}
        </Button>
      </Action>
    </ModalBox>
  )
}

export default ConfirmationModal
