import type { LoaderArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { TypedMetaFunction } from "remix-typedjson";
import { Form, Link, Outlet } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import { isProjectTeamMember, getProject } from "~/models/project.server";
import { adminRoleName } from "app/constants";
import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
  Tabs,
  Tab,
  Stack,
  Grid,
} from "@mui/material";
import GoBack from "~/core/components/GoBack";
import type { SyntheticEvent } from "react";
import { useState, useEffect } from "react";
import { ValidatedForm, useIsSubmitting } from "remix-validated-form";
import Header from "~/core/layouts/Header";
import { EditPanelsStyles } from "~/routes/manager/manager.styles";
import TabPanel from "~/core/components/TabPanel";
import MDEditorStyles from "@uiw/react-md-editor/markdown-editor.css";
import MarkdownStyles from "@uiw/react-markdown-preview/markdown.css";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import Markdown from "marked-react";
import TextEditor from "~/core/components/TextEditor";

export function links() {
  return [
    { rel: "stylesheet", href: MDEditorStyles },
    { rel: "stylesheet", href: MarkdownStyles },
  ];
}

export const taskValidator = withZod(
  zfd
    .formData({
      id: z.string().optional(),
      description: z.string().min(3, "Provide a valid description"),
      position: zfd.numeric(),
      projectStageId: z.string(),
    })
    .transform((val) => {
      return val;
    })
);

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  const project = await getProject({ id: projectId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }
  const user = await requireUser(request);
  const profile = await requireProfile(request);
  const isTeamMember = isProjectTeamMember(profile.id, project);
  const isAdmin = user.role == adminRoleName;
  const profileId = profile.id;
  const projectStages = project.stages;

  return typedjson({
    isAdmin,
    isTeamMember,
    profile,
    project,
    profileId,
    projectId,
    projectStages,
  });
};

export const meta: TypedMetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: "Missing Project",
      description: `There is no Project with the ID of ${params.projectId}. 😢`,
    };
  }

  const { project } = data;
  return {
    title: `${project?.name} - Contributor's Path`,
    description: project?.description,
  };
};

export default function EditContributorsPathPage() {
  const { isAdmin, project, projectId, projectStages } =
    useTypedLoaderData<typeof loader>();

  const [tabIndex, setTabIndex] = useState(1);
  const handleTabChange = (event: SyntheticEvent, tabNumber: number) =>
    setTabIndex(tabNumber);

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

  const handleEditTask = (val: any) => {
    setEditTask(val);
    setCreateTask("");
  };
  const handleCreateTask = (val: any) => {
    setEditTask("");
    setCreateTask(val);
  };

  const taskIsSubmitting = useIsSubmitting("taskForm");

  const [editTask, setEditTask] = useState("");
  const [createTask, setCreateTask] = useState("");

  useEffect(() => {
    if (taskIsSubmitting) {
      handleEditTask("");
      handleCreateTask("");
    }
  });

  return (
    <>
      <Header title={"Edit " + project.name} />
      <Outlet></Outlet>

      <Container>
        <Paper elevation={0} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <h1 className="form__center-text">Edit {project.name}</h1>
        </Paper>
      </Container>

      <Container>
        <Paper
          elevation={0}
          sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}
        >
          <GoBack title="Back to project" href={`/projects/${projectId}`} />

          <EditPanelsStyles>
            <Box>
              <Tabs
                value={tabIndex}
                onChange={handleTabChange}
                aria-label="Edit project"
              >
                <Tab
                  component={Link}
                  label="Project Details"
                  to={`/projects/${projectId}/edit`}
                />
                <Tab
                  component={Link}
                  label="Contributor's Path"
                  to={`/projects/${projectId}/editContributorsPath`}
                />
              </Tabs>
            </Box>

            <TabPanel value={tabIndex} index={0}></TabPanel>
            <TabPanel value={tabIndex} index={1}>
              <Grid
                container
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
                mb={4}
              >
                <Grid item>
                  <Link to={`createStage`}>
                    <Button variant="contained">Add Stage</Button>
                  </Link>
                </Grid>
              </Grid>

              {projectStages?.map((stage, index) => (
                <Stack
                  key={stage.id}
                  mb={2}
                  padding={4}
                  style={{
                    border: "2px solid #e2e2e2",
                    borderRadius: "1em",
                  }}
                >
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <h2>{stage.name}</h2>
                    </Grid>
                    <Grid item>
                      <Grid
                        container
                        justifyContent="flex-end"
                        alignItems="center"
                        spacing={2}
                      >
                        <Grid item>
                          <Link to={`deleteStage?id=${stage.id}`}>
                            <Button variant="contained">Delete Stage</Button>
                          </Link>
                        </Grid>
                        <Grid item>
                          <Link to={`editStage?id=${stage.id}`}>
                            <Button variant="contained">Edit Stage</Button>
                          </Link>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                  <Grid
                    container
                    spacing={2}
                    mt={2}
                    justifyContent="space-between"
                    alignItems="stretch"
                  >
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      p={2}
                      style={{
                        border: "2px solid #f1f1f1",
                        borderRadius: "1em",
                      }}
                    >
                      <h3>Criteria:</h3>
                      <Markdown>{stage.criteria}</Markdown>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      sm
                      p={2}
                      style={{
                        border: "2px solid #f1f1f1",
                        borderRadius: "1em",
                      }}
                    >
                      <h3>Mission:</h3>
                      <Markdown>{stage.mission}</Markdown>
                    </Grid>
                  </Grid>
                  <h3>Tasks:</h3>
                  {stage.projectTasks.map((task, indeB) => (
                    <Stack key={task.id}>
                      <Grid
                        container
                        justifyContent="space-between"
                        alignItems="flex-start"
                      >
                        <Grid item style={{ minWidth: "70%" }}>
                          {editTask === task.id ? (
                            <>
                              <ValidatedForm
                                id="taskForm"
                                validator={taskValidator}
                                defaultValues={{
                                  id: task.id || "",
                                  description: task.description,
                                  position: task.position,
                                  projectStageId: task.projectStageId,
                                }}
                                method="post"
                                action="./editTask"
                              >
                                <input
                                  type="hidden"
                                  name="id"
                                  value={task.id}
                                />
                                <input
                                  type="hidden"
                                  name="position"
                                  value={task.position}
                                />
                                <input
                                  type="hidden"
                                  name="projectStageId"
                                  value={task.projectStageId}
                                />
                                <TextEditor
                                  name={`description`}
                                  label="Description"
                                  placeholder={"Describe the task..."}
                                />
                              </ValidatedForm>
                            </>
                          ) : (
                            <Markdown>{task.description}</Markdown>
                          )}
                        </Grid>
                        <Grid item>
                          <Grid
                            container
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={2}
                            mt={1}
                            mb={2}
                          >
                            {editTask === task.id ? (
                              <>
                                <Grid item>
                                  <Link
                                    to={`deleteTask?id=${task.id}&stageId=${stage.id}`}
                                  >
                                    <Button variant="contained">Delete</Button>
                                  </Link>
                                </Grid>
                                <Grid item>
                                  <Button
                                    type="submit"
                                    form="taskForm"
                                    variant="contained"
                                    disabled={taskIsSubmitting}
                                  >
                                    {taskIsSubmitting
                                      ? "Saving..."
                                      : "Save"}
                                  </Button>
                                </Grid>
                                <Grid item>
                                  <Button
                                    variant="contained"
                                    onClick={() => handleEditTask("")}
                                  >
                                    Cancel
                                  </Button>
                                </Grid>
                              </>
                            ) : (
                              <Grid item>
                                <Button
                                  variant="contained"
                                  onClick={() => handleEditTask(task.id)}
                                >
                                  Edit
                                </Button>
                              </Grid>
                            )}
                          </Grid>
                        </Grid>
                      </Grid>
                    </Stack>
                  ))}
                  <Stack>
                    <Grid
                      container
                      justifyContent="space-between"
                      alignItems="flex-start"
                    >
                      {createTask === stage.id ? (
                        <>
                          <Grid item style={{ minWidth: "70%" }}>
                            <ValidatedForm
                              id="taskForm"
                              validator={taskValidator}
                              defaultValues={{
                                id: "",
                                description: "",
                                position: stage.projectTasks.length + 1,
                                projectStageId: stage.id,
                              }}
                              method="post"
                              action="./editTask"
                            >
                              <input type="hidden" name="id" value="" />
                              <input
                                type="hidden"
                                name="position"
                                value={stage.projectTasks.length + 1}
                              />
                              <input
                                type="hidden"
                                name="projectStageId"
                                value={stage.id}
                              />
                              <TextEditor
                                name={`description`}
                                label="Description"
                                placeholder={"Describe the task..."}
                              />
                            </ValidatedForm>
                          </Grid>
                          <Grid item>
                            <Grid
                              container
                              justifyContent="flex-end"
                              alignItems="center"
                              spacing={2}
                              mt={1}
                              mb={2}
                            >
                              <Grid item>
                                <Button
                                  type="submit"
                                  form="taskForm"
                                  variant="contained"
                                  disabled={taskIsSubmitting}
                                >
                                  {taskIsSubmitting
                                    ? "Saving..."
                                    : "Save"}
                                </Button>
                              </Grid>
                              <Grid item>
                                <Button
                                  variant="contained"
                                  onClick={() => handleEditTask("")}
                                >
                                  Cancel
                                </Button>
                              </Grid>
                            </Grid>
                          </Grid>
                        </>
                      ) : (
                        <Grid
                          container
                          justifyContent="center"
                          alignItems="cente"
                          mt={4}
                        >
                          <Grid item>
                            <Button onClick={() => handleCreateTask(stage.id)}>
                              Add Task
                            </Button>
                          </Grid>
                        </Grid>
                      )}
                    </Grid>
                  </Stack>
                </Stack>
              ))}
            </TabPanel>
          </EditPanelsStyles>
          {isAdmin && (
            <Button
              onClick={handleClickOpen}
              color="warning"
              variant="contained"
            >
              {"Delete Project"}
            </Button>
          )}
        </Paper>
      </Container>
      <Dialog onClose={handleClose} open={open}>
        <DialogTitle>
          Are you sure you want to delete this proposal?
        </DialogTitle>
        <Form action={`/projects/delete`} method="delete">
          <DialogContent>
            This action cannot be undone.
            <input type="hidden" name="projectId" value={projectId} />
          </DialogContent>
          <DialogActions>
            <Button variant="contained" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              variant="contained"
              disabled={isButtonDisabled}
              color="warning"
              type="submit"
            >
              Yes, delete it
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}
