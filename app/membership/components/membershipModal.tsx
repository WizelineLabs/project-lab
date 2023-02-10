import { ValidatedForm } from "remix-validated-form";
import ModalBox from "../../core/components/ModalBox/index";
import { Button, Checkbox, FormControlLabel, Grid } from "@mui/material";
import DisciplinesSelect from "~/core/components/DisciplinesSelect";
import LabeledTextField from "~/core/components/LabeledTextField";
import SkillsSelect from "~/core/components/SkillsSelect";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";

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
        <h2
          style={{ textAlign: "center", marginTop: "30px", fontSize: "20px" }}
        >
          Hey!, it seems like you haven't been involved in these projects in a
          while. Are you still working on it?
        </h2>
        <h3 style={{ fontSize: "24px", fontWeight: "bold", margin: "8px" }}>
          Wizelabs
        </h3>

        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "space-between",
            marginTop: "5px",
          }}
        >
          <div style={{ width: "20%", textAlign: "center" }}>
            <LabeledTextField
              name="hoursPerWeek"
              fullWidth
              label="Hours per Week"
              type="number"
              style={{ fontSize: "12px" }}
            />
          </div>
          <div style={{ width: "30%", textAlign: "center" }}>
            <DisciplinesSelect name="role" label="Role(s)" />
          </div>
          <div style={{ width: "30%", textAlign: "center" }}>
            <SkillsSelect name="practicedSkills" label="Skills" />
          </div>
          <div
            style={{
              width: "20%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Checkbox
              checked={true}
              style={{ width: "50px", height: "50px", marginRight: "5px" }}
            />
            Active
          </div>
        </div>

        <Button type="submit" variant="contained" style={{ marginTop: "20px" }}>
          Save
        </Button>
      </ValidatedForm>
    </ModalBox>
  );
};

export default MembershipModal;
