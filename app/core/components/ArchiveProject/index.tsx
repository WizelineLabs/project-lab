import { Archive } from "@mui/icons-material";
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

export const ArchiveProject = ({ projectId }: { projectId?: string }) => {
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
      <Tooltip title="Archive project">
        <IconButton
          onClick={handleClickOpen}
          aria-label="Archive-project-button"
        >
          <Archive />
        </IconButton>
      </Tooltip>

      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          Are you sure you want to archive this proposal?
        </DialogTitle>
        <Form action={`/projects/archive`} method="post">
          <DialogContent>
            You can unarchive the project later.
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
              Yes,archive it
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
};
