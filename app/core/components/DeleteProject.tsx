import { TextField } from "@mui/material"
import ConfirmationModal from "app/core/components/ConfirmationModal"
import { useState } from "react"

const DeleteButton = (props: { deleteProjectMutation: (arg0: { id: any }) => any; project: { id: any; name: any }; router: string[] }) => {
  const [open, setOpen] = useState(false)
  const [deleteBtn, setDeleteBtn] = useState(true)
  const [hasError, setHasError] = useState(false)

  const handleOpen = () => {
    setOpen(true)
  }

  const handleClose = () => {
    setOpen(false)
  }

  const deleteProposal = async () => {
    try {
      await props.deleteProjectMutation({ id: props.project.id })
      props.router.push("/");
    } catch (error) {
      handleClose()
      console.log(error)
      setHasError(true)
    }
  }

  const projectName = (e: { target: { value: any } }) => {
    const value = e.target.value != props.project.name
    setDeleteBtn(value)
    setHasError(value)
  }

  return (
    <>
      <button type="button" className="primary warning" onClick={handleOpen}>
        Delete
      </button>

      <ConfirmationModal
        open={open}
        handleClose={handleClose}
        close={() => handleClose()}
        label="Delete"
        className="warning"
        disabled={deleteBtn}
        onClick={deleteProposal}
      >
        <h2>Are you sure you want to delete this proposal?</h2>
        <p>This action cannot be undone.</p>
        <br />
        <TextField
          label={`Type ${props.project.name}`}
          type="text"
          error={hasError}
          style={{ width: "100%" }}
          onChange={projectName}
        />
        <br />
      </ConfirmationModal>
    </>
  )
}

export default DeleteButton
