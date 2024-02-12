import { LabeledCheckbox } from "../LabeledCheckbox";
import ModalBox from "../ModalBox/index";
import { ModalText } from "./MemberModal.styles";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Grid,
  Typography,
} from "@mui/material";
import { withZod } from "@remix-validated-form/with-zod";
import { ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import DisciplinesSelect from "~/core/components/DisciplinesSelect";
import LabeledTextField from "~/core/components/LabeledTextField";
import SkillsSelect from "~/core/components/SkillsSelect";
import type { projectMembership } from "~/routes/projects._index";

interface IProps {
  open: boolean;
  handleCloseModal?: React.MouseEventHandler;
  projects: projectMembership[];
}

export const multipleProjectsValidator = withZod(
  zfd.formData({
    projects: z.array(
      z.object({
        id: z.string(),
        hoursPerWeek: zfd
          .numeric(z.number().nullish())
          .transform((v) => (v === null ? undefined : v)),
        role: z
          .array(
            z.object({
              id: z.string(),
              name: z.string().optional(),
            })
          )
          .nonempty(),
        practicedSkills: z.array(
          z.object({
            id: z.string(),
            name: z.string().optional(),
          })
        ),
        active: zfd.checkbox(),
        profileId: z.string(),
        projectId: z.string(),
      })
    ),
  })
);

const MembershipModal = (props: IProps) => {
  const { projects } = props;
  const projectsCount = projects.length;

  return (
    <ModalBox
      open={props.open}
      close={props.handleCloseModal}
      boxStyle={{ width: "950px" }}
    >
      <ModalText>
        Hey!, it seems like you haven&apos;t been involved in these projects in
        a while. Are you still working on it?
      </ModalText>
      {projectsCount >= 1 ? (
        <Grid>
          <ValidatedForm
            name="projectMembershipForm"
            defaultValues={{
              projects: projects,
            }}
            validator={multipleProjectsValidator}
            action="./manageMembership"
            method="post"
          >
            <>
              {projects.map((item, i) => (
                <Accordion key={i} defaultExpanded={i == 0}>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography>{item.project.name}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <input
                      type="hidden"
                      name={`projects[${i}].id`}
                      value={item.id}
                    />
                    <input
                      type="hidden"
                      name={`projects[${i}].profileId`}
                      value={item.profileId}
                    />
                    <input
                      type="hidden"
                      name={`projects[${i}].projectId`}
                      value={item.projectId}
                    />
                    <Grid
                      container
                      spacing={1}
                      alignItems="baseline"
                      rowSpacing={{ xs: 2, sm: 2 }}
                      style={{ paddingTop: 20 }}
                      justifyContent="space-evenly"
                    >
                      <Grid item xs={6} sm={1}>
                        <LabeledTextField
                          label="Hours"
                          helperText="H. per week"
                          name={`projects[${i}].hoursPerWeek`}
                          size="small"
                          type="number"
                          sx={{
                            "& .MuiFormHelperText-root": {
                              marginLeft: 0,
                              marginRight: 0,
                              textAlign: "center",
                            },
                          }}
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <DisciplinesSelect //still uses constant values instead of values taken from the db
                          name={`projects[${i}].role`}
                          label="Role(s)"
                        />
                      </Grid>

                      <Grid item xs={12} sm={4}>
                        <SkillsSelect //still uses constant values instead of values taken from the db
                          name={`projects[${i}].practicedSkills`}
                          label="Skills"
                        />
                      </Grid>

                      <Grid item xs={2} sm={1}>
                        <LabeledCheckbox
                          name={`projects[${i}].active`}
                          label="Active"
                        />
                      </Grid>
                    </Grid>
                  </AccordionDetails>
                </Accordion>
              ))}
            </>
            <Grid
              container
              direction="row"
              justifyContent="flex-end"
              alignItems="flex-end"
            >
              <Button type="submit" variant="contained">
                Save
              </Button>
            </Grid>
          </ValidatedForm>
        </Grid>
      ) : null}
    </ModalBox>
  );
};

export default MembershipModal;
