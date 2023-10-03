import { FieldArray, ValidatedForm } from "remix-validated-form";
import ModalBox from "../ModalBox/index";
import { Accordion, AccordionDetails, AccordionSummary, Button, Card, CardContent, CardHeader, Grid, Typography } from "@mui/material";
import DisciplinesSelect from "~/core/components/DisciplinesSelect";
import LabeledTextField from "~/core/components/LabeledTextField";
import SkillsSelect from "~/core/components/SkillsSelect";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { ModalText} from "./MemberModal.styles";
import type { projectMembership } from "~/routes/projects";
import { LabeledCheckbox } from "../LabeledCheckbox";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface IProps {
  open: boolean;
  handleCloseModal: Function;
  projects:projectMembership[];
}

export const multipleProjectsValidator = withZod (
  zfd.formData({
    projects: z.array(
        z.object({
          id: z.string(),
          hoursPerWeek: zfd.numeric(z.number()),
          role: z
            .array(
              z.object({
                id: z.string(),
                name: z.string().optional(),
              })
            ).nonempty(),
          practicedSkills: z
            .array(
              z.object({
                id: z.string(),
                name: z.string().optional(),
              })
            ).nonempty(),
            active: zfd.checkbox(),
            profileId: z.string(),
            projectId: z.string(),
        })
      ),
      })
);

export const validator = withZod( //this is the same of join project
  zfd.formData({
    id: z.string(),
    hoursPerWeek: zfd.numeric(z.number()),
    role: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().optional(),
        })
      ).nonempty(),
    practicedSkills: z
      .array(
        z.object({
          id: z.string(),
          name: z.string().optional(),
        })
      ).nonempty(),
      active: zfd.checkbox(),
      profileId: z.string(),
      projectId: z.string(),
  })
);


const MembershipModal = (props: IProps) => {
  const{ projects } = props;
  let projectsCount = projects.length;

  return (
    <ModalBox
      open={props.open}
      close={props.handleCloseModal}
      handleClose={() => {}}
      boxStyle={{ width: "950px" }}
    >
        <ModalText>
          Hey!, it seems like you haven't been involved in these projects in a
          while. Are you still working on it?
        </ModalText>
        { 
          projectsCount == 1 && projects.map((project, id) => {
            return (
                <Grid key={id}>
                  <Card>
                    <CardHeader 
                      title={project.project?.name}
                    />
                    <CardContent>
                      <ValidatedForm
                          validator={ validator }
                          defaultValues={{
                            hoursPerWeek: project.hoursPerWeek,
                            role: project.role,
                            practicedSkills: project.practicedSkills,
                            active: project.active,
                            id: project.id,
                            profileId: project.profileId
                          }}
                          method="post"
                          action="./singleManageMembership"
                        >
                          <input
                            type="hidden"
                            name="id"
                            value={project.id}
                          />
                          <input
                            type="hidden"
                            name="profileId"
                            value={project.profileId}
                          />
                          <input
                            type="hidden"
                            name="projectId"
                            value={project.projectId}
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
                                name={`hoursPerWeek`}
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
                                name="role"
                                label="Role(s)"
                              />
                            </Grid>  
                              
                            <Grid item xs={12} sm={4}>
                              <SkillsSelect //still uses constant values instead of values taken from the db
                                name="practicedSkills"
                                label="Skills"
                              />
                            </Grid>

                            <Grid
                              item
                              xs={2}
                              sm={1}
                              
                            >
                              <LabeledCheckbox
                                name="active"
                                label="Active"
                              />
                            </Grid>

                          </Grid>
                          <Grid container direction="row"
                                justifyContent="flex-end"
                                alignItems="flex-end">   
                            <Button type="submit" variant="contained">
                              Save
                            </Button>
                          </Grid>
                        </ValidatedForm>
                    </CardContent>
                  </Card>
                </Grid>
            )
          })
        }
        {
          projectsCount > 1 && (
            <Grid>
              <ValidatedForm 
                defaultValues={{
                  projects: projects
                }}
                validator={multipleProjectsValidator} 
                action="./manageMembership"
                method="post"
              >
                    
                <FieldArray name="projects">
                  {
                    (items, { push, remove }) => (
                      <>
                        {
                          items.map((item, i) => (
                            <Accordion key={i}>
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
                          ))
                        }
                      </>
                    )
                  }
                </FieldArray>
                <Grid container direction="row"
                  justifyContent="flex-end"
                  alignItems="flex-end">   
                    <Button type="submit" variant="contained">
                      Save
                    </Button>
                </Grid>
              </ValidatedForm>
            </Grid>

          )
        }
       

    </ModalBox>
  );
};

export default MembershipModal;
