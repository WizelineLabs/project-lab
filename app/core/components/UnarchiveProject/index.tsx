import { Unarchive } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Tooltip,
} from "@mui/material";
import { Form, useTransition } from "@remix-run/react";
import { useEffect, useState } from "react";

export const UnarchiveProject = ({ projectId }: { projectId: string }) => {
  const [open, setOpen] = useState(false);
  const [isButtonDisabled, setisButtonDisabled] = useState(true);

  const handleClickOpen = () => {
    setOpen(true);

    setTimeout(() => setisButtonDisabled(false), 5000);
  };

  const handleClose = () => {
    setisButtonDisabled(true);
    setOpen(false);
  };

  const transition = useTransition();
  useEffect(() => {
    if (transition.type == "actionRedirect") {
      setOpen(false);
    }
  }, [transition]);

  return (
    <>
      <Tooltip title="Unarchive project">
        <IconButton
          onClick={handleClickOpen}
          aria-label="Unarchive-project-button"
        >
          <Unarchive color="secondary" />
        </IconButton>
      </Tooltip>

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          Are you sure you want to unarchive this proposal?
        </DialogTitle>
        <Form action={`/projects/unarchive`} method="post">
          <DialogContent>
            This action will unarchive the project and will be available again.
            <input type="hidden" name="projectId" value={projectId} />
          </DialogContent>
          <DialogActions>
            <Button className="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={isButtonDisabled}
              type="submit"
              className="primary warning"
            >
              Unarchive it
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
};
