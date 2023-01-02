import LabeledTextField from "app/core/components/LabeledTextField";
import DisciplinesSelect from "app/core/components/DisciplinesSelect";
import SkillsSelect from "app/core/components/SkillsSelect";
import ModalBox from "app/core/components/ModalBox";
import Button from "@mui/material/Button";

import {
  Grid,
  FormDivContainer,
  CommitmentDivContainer,
} from "./joinProjectModal.styles";
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";

interface IProps {
  open: boolean;
  handleCloseModal: Function;
  projectId: string;
}

export const validator = withZod(
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

const JoinProjectModal = (props: IProps) => {
  return (
    <ModalBox
      open={props.open}
      close={props.handleCloseModal}
      handleClose={() => {}}
      boxStyle={{ width: "800px" }}
    >
      <ValidatedForm method="post" action="./joinProject" validator={validator}>
        <Grid>
          <FormDivContainer>
            <h1>Join Project</h1>

            <p className="question">What role will you be playing?</p>
            <DisciplinesSelect name="role" label="Role(s)" />

            <p className="question">What's your availability?</p>
            <LabeledTextField
              name="hoursPerWeek"
              fullWidth
              label="Hours per Week"
              type="number"
              outerProps={{ style: { marginTop: 10, marginBottom: 20 } }}
            />

            <p className="question">Which skills are you practicing?</p>
            <SkillsSelect name="practicedSkills" label="Skills" />
          </FormDivContainer>

          <CommitmentDivContainer>
            <p className="title">We are excited to have you on board!</p>
            <ul>
              <li>
                <strong>Everyone</strong> is welcome to join the project,
                whether you have the skills we are looking for and want to
                sharpen them, or are eager to learn something new.
              </li>
              <li>
                Take <strong>ownership</strong> of your role in the project,
                stay on track with your Contributor Path, take initiative,
                participate and ask questions.
              </li>
              <li>
                Keep in mind that if you are assigned to work with a client it
                will have a higher priority, but you can keep participating.
              </li>
              <li>
                You are free to leave a project at any time, just let your team
                know about it and do a <strong>knowledge transfer</strong> of
                your latest contributions.
              </li>
            </ul>
            <p>&nbsp;</p>
            <Button type="submit" variant="contained">
              Join Project
            </Button>
          </CommitmentDivContainer>
        </Grid>
      </ValidatedForm>
    </ModalBox>
  );
};

export default JoinProjectModal;
