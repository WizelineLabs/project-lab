import { useState } from "react"
import ModalBox from "../../core/components/ModalBox/index"

interface IProps {
  open: boolean
  handleClose: React.MouseEventHandler
  close: Function
  label: string
  onClick: React.MouseEventHandler
  disabled?: boolean | false
  className?: string | ""
}

const MembershipModal = ({ ...props }: IProps) => {
  return (
    <>
      <ModalBox open={props.open} close={props.close} handleClose={props.handleClose}>
        <h2>
          Hey, it seems like you haven't been involved in these projects in a while. Are you still
          working on it?
        </h2>
      </ModalBox>
    </>
  )
}

export default MembershipModal
