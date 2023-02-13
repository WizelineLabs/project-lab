import { ValidatedForm } from "remix-validated-form";
import ModalBox from "../ModalBox/index";
import { Button, Checkbox, FormControlLabel, Grid } from "@mui/material";
import DisciplinesSelect from "~/core/components/DisciplinesSelect";
import LabeledTextField from "~/core/components/LabeledTextField";
import SkillsSelect from "~/core/components/SkillsSelect";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { Title } from "@mui/icons-material";
import { ProjectName, FlexContainer, CenterItems} from "./MemberModal.styles";

interface IProps {
  open: boolean;
  handleCloseModal: Function;
}

export const validator = withZod( //this is the same of join project
  zfd.formData({
    hoursPerWeek: zfd.numeric(z.number().optional()),
    role: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().optional(),
        })
      )
      .optional(),
    practicedSkills: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().optional(),
        })
      )
      .optional(),
  })
);
// put all the css in another file
const MembershipModal = (props: IProps) => {
  return (
    <ModalBox
      open={props.open}
      close={props.handleCloseModal}
      handleClose={() => {}}
      boxStyle={{ width: "800px" }}
    >
      <ValidatedForm method="post" validator={validator}>
        <Title>
          Hey!, it seems like you haven't been involved in these projects in a
          while. Are you still working on it?
        </Title>
        <ProjectName>Wizelabs</ProjectName>
        <FlexContainer>
          <LabeledTextField
            name="hoursPerWeek"
            fullWidth
            label="Hours per Week"
            type="number"
            style={{ fontSize: "12px" }}
          />
          <DisciplinesSelect name="role" label="Role(s)" />
          <SkillsSelect name="practicedSkills" label="Skills" />
          <CenterItems>
            <Checkbox checked={true} />
            Active
          </CenterItems>
        </FlexContainer>
        <Button type="submit" variant="contained">
          Save
        </Button>
      </ValidatedForm>
    </ModalBox>
  );
};

export default MembershipModal;
