import React from "react"
import { Modal, Box, IconButton } from "@mui/material"
import styled from "@emotion/styled"
import { Close as CloseIcon } from "@mui/icons-material"

export const BoxContainer = styled.div`
  width: 500px;
  margin: 0 auto;
  background: #fff;
  padding: 10px;
  border-radius: 4px;
`

export const ModalContainer = styled.div`
  display: flex;
  align-items: center;
  height: 100%;
`

export const Action = styled.div`
  display: flex;
  justify-content: flex-end;
`

interface IProps {
  children: React.ReactNode
  open: boolean
  handleClose: React.MouseEventHandler
  close: Function
  boxStyle?: React.CSSProperties
}

export const ModalBox = ({ children, boxStyle, ...props }: IProps) => {
  return (
    <Modal
      open={props.open}
      onClose={props.handleClose}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <ModalContainer>
        <BoxContainer style={boxStyle}>
          <Box sx={{ marginTop: "0px" }}>
            <Action>
              <IconButton onClick={() => props.close()}>
                <CloseIcon />
              </IconButton>
            </Action>
            {children}
          </Box>
        </BoxContainer>
      </ModalContainer>
    </Modal>
  )
}

export default ModalBox
