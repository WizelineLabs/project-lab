import ModalBox from "../../core/components/ModalBox/index";
import { Checkbox, FormControlLabel, TextField } from "@mui/material";
import DisciplinesSelect from "~/core/components/DisciplinesSelect";
import { FormDivContainer } from "~/core/components/JoinProjectModal/joinProjectModal.styles";
import LabeledTextField from "~/core/components/LabeledTextField";
import SkillsSelect from "~/core/components/SkillsSelect";

interface IProps {
  open: boolean;
  handleCloseModal: Function;
  close: Function;
}

const MembershipModal = (props: IProps) => {
  return (
    <ModalBox
      open={props.open}
      close={props.handleCloseModal}
      handleClose={() => {}}
      boxStyle={{ width: "800px" }}
    >
      <FormDivContainer>
        <h2>
          Hey!, it seems like you haven't been involved in these projects in a
          while. Are you still working on it?
        </h2>

        <LabeledTextField
          name="hoursPerWeek"
          fullWidth
          label="Hours per Week"
          type="number"
          outerProps={{ style: { marginTop: 10, marginBottom: 20 } }}
        />

        <DisciplinesSelect name="role" label="Role(s)" />

        <SkillsSelect name="practicedSkills" label="Skills" />
        <FormControlLabel
          control={<Checkbox checked={true} />}
          label={`Project is Active`}
        />
      </FormDivContainer>
    </ModalBox>
  );
};

export default MembershipModal;
