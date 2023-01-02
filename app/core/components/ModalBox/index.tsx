import React from "react";
import { Modal, IconButton, styled } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";

export const BoxContainer = styled("div")(({ theme }) => ({
  backgroundColor: theme.palette.background.default,
  width: 500,
  margin: "auto",
  padding: theme.spacing(2),
  borderRadius: 1,
}));

export const ModalContainer = styled("div")`
  display: flex;
  align-items: center;
  height: 100%;
`;

export const Action = styled("div")`
  float: right;
`;

interface IProps {
  children: React.ReactNode;
  open: boolean;
  handleClose?: React.MouseEventHandler;
  close: Function;
  boxStyle?: React.CSSProperties;
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
          <Action>
            <IconButton onClick={() => props.close()}>
              <CloseIcon />
            </IconButton>
          </Action>
          {children}
        </BoxContainer>
      </ModalContainer>
    </Modal>
  );
};

export default ModalBox;
