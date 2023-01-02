import { useState } from "react";

import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import type { SelectChangeEvent } from "@mui/material/Select";

import type { ProjectComplete } from "~/models/project.server";
import type { ProjectMembers } from "@prisma/client";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import ModalBox from "./ModalBox";
import { Button } from "@mui/material";

interface IProps {
  close: () => void;
  member: ProjectMembers;
  open: boolean;
  project: ProjectComplete;
}

export const validator = withZod(
  zfd.formData({
    active: z.string().transform((val) => (val == "on" ? true : false)),
    newOwner: z.string().optional(),
  })
);

const MembershipStatusModal = ({ close, member, open, project }: IProps) => {
  const [disableBtn, setDisableBtn] = useState(
    member.profileId === project.ownerId
  );
  const [newOwner, setNewOwner] = useState("");

  const handleChange = (e: SelectChangeEvent<string>) => {
    setNewOwner(e.target.value);
    setDisableBtn(false);
  };

  const RenderModalContent = () => {
    let title: string;
    let content: string;

    if (member.profileId === project.ownerId) {
      // In case it is the owner the one who is leaving...
      return (
        <>
          <h1>Before you leave...</h1>
          <p>
            Currently you are the Owner of this project. Please, assign a new
            owner before leaving the project.
          </p>
          <FormControl fullWidth>
            <InputLabel id="members-label">Members</InputLabel>
            <input type="hidden" name="newOwner" value={newOwner} />
            <Select
              label="Members"
              labelId="members-label"
              onChange={(e) => handleChange(e)}
              style={{ width: "100%" }}
              value={newOwner}
            >
              {project.projectMembers
                ?.filter(
                  (member) =>
                    member.profileId !== project.ownerId &&
                    member.active === true
                )
                .map((member, index) => {
                  return (
                    <MenuItem key={index} value={member.profileId}>
                      {member.profile.firstName} {member.profile.lastName} (
                      {member.profile.email})
                    </MenuItem>
                  );
                })}
            </Select>
          </FormControl>
        </>
      );
    } else if (member.active) {
      // In case any NO OWNER member leaves...
      title = "Come back soon!";
      content =
        "By confirming you will be inactive for this project but you can join again at anytime.";
    } else {
      title = "Welcome back!";
      content = "Do you want to contribute again?";
    }

    return (
      <>
        <h1>{title}</h1>
        <p>{content}</p>
      </>
    );
  };

  return (
    <ModalBox close={close} open={open}>
      <ValidatedForm
        method="post"
        action="./updateMembership"
        validator={validator}
      >
        <input type="hidden" name="active" value={member.active ? "" : "on"} />
        <RenderModalContent />
        <Button variant="outlined" color="secondary" onClick={() => close()}>
          Cancel
        </Button>
        &nbsp;
        <Button
          variant="outlined"
          color={`warning`}
          disabled={disableBtn}
          type="submit"
        >
          Confirm
        </Button>
      </ValidatedForm>
    </ModalBox>
  );
};

export default MembershipStatusModal;
