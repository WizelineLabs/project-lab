import type { ActionFunction, LoaderArgs } from "@remix-run/node";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import type { TypedMetaFunction } from "remix-typedjson";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import {
  isProjectTeamMember,
  getProject,
  updateProjects,
} from "~/models/project.server";
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
} from "@mui/material";
import GoBack from "~/core/components/GoBack";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import { ProjectForm } from "../components/ProjectForm";
// import ProjectContributorsPathForm from "../components/ProjectContributorsPathForm";
import { ValidatedForm, validationError } from "remix-validated-form";
import { validator } from "../create";
import Header from "~/core/layouts/Header";
import { EditPanelsStyles } from "~/routes/manager/manager.styles";
import { TabStyles } from "../components/Styles/TabStyles.component";
import TabPanel from "~/core/components/TabPanel";
import { getProjectStatuses } from "~/models/status.server";
import { getInnovationTiers } from "~/models/innovationTier.server";
import MDEditorStyles from "@uiw/react-md-editor/markdown-editor.css";
import MarkdownStyles from "@uiw/react-markdown-preview/markdown.css";
import { isProjectMemberOrOwner } from "~/utils";
import { Link } from "@remix-run/react";

export function links() {
  return [
    { rel: "stylesheet", href: MDEditorStyles },
    { rel: "stylesheet", href: MarkdownStyles },
  ];
}

export const loader = async ({ request, params }: LoaderArgs) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  const project = await getProject({ id: projectId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  const statuses = await getProjectStatuses();
  const tiers = await getInnovationTiers();
  const user = await requireUser(request);
  const profile = await requireProfile(request);
  const isTeamMember = isProjectTeamMember(profile.id, project);
  const isAdmin = user.role == adminRoleName;
  const profileId = profile.id;

  return typedjson({
    isAdmin,
    isTeamMember,
    profile,
    project,
    profileId,
    projectId,
    statuses,
    tiers,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  // Validate permissions
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;
  if (!isAdmin) {
    const profile = await requireProfile(request);
    const currentProject = await getProject({ id: projectId });
    const {
      projectMembers: currentMembers = [],
      ownerId: currentOwnerId = null,
    } = currentProject;
    isProjectMemberOrOwner(profile.id, currentMembers, currentOwnerId);
  }

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);
  const project = await updateProjects(projectId, result.data);
  return redirect(`/projects/${project.id}`);
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
    title: `${project?.name} edit project`,
    description: project?.description,
  };
};

export default function EditProjectPage() {
  const { isAdmin, project, projectId, statuses, tiers } =
    useTypedLoaderData<typeof loader>();

  const [tabIndex, setTabIndex] = useState(0);
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

  return (
    <>
      <Header title={"Edit " + project.name} />

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
                {/* <TabStyles label="Project Details" />
                <TabStyles label="Contributor's Path" /> */}
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

            <TabPanel value={tabIndex} index={0}>
              <ValidatedForm
                validator={validator}
                defaultValues={{
                  name: project.name,
                  projectStatus: project.projectStatus || undefined,
                  innovationTiers: project.innovationTiers || undefined,
                  description: project.description || "",
                  valueStatement: project.valueStatement || "",
                  helpWanted: project.helpWanted,
                  disciplines: project.disciplines,
                  owner: project.owner || undefined,
                  target: project.target || "",
                  repoUrls: project.repoUrls || [],
                  slackChannel: project.slackChannel || "",
                  skills: project.skills,
                  labels: project.labels,
                  projectBoard: project.projectBoard || "",
                }}
                method="post"
              >
                <ProjectForm statuses={statuses} tiers={tiers} />
              </ValidatedForm>
            </TabPanel>
            <TabPanel value={tabIndex} index={1}></TabPanel>
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
