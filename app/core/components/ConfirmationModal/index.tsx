import ModalBox from "../ModalBox";
import styled from "@emotion/styled";
import { Button } from "@mui/material";
import React from "react";

interface IProps {
  children: React.ReactNode;
  open: boolean;
  handleClose?: React.MouseEventHandler;
  close: Function;
  label: string;
  onClick: React.MouseEventHandler;
  disabled?: boolean | false;
  className?: string | "";
}

export const Action = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const ConfirmationModal = ({ children, ...props }: IProps) => {
  return (
    <ModalBox
      open={props.open}
      close={props.close}
      handleClose={props.handleClose}
    >
      {children}
      <br />
      <Action>
        <Button
          variant="outlined"
          color="secondary"
          onClick={() => props.close()}
        >
          Cancel
        </Button>
        &nbsp;
        <Button
          variant="outlined"
          color={`warning`}
          disabled={props.disabled}
          onClick={props.onClick}
        >
          {props.label}
        </Button>
      </Action>
    </ModalBox>
  );
};

export default ConfirmationModal;
