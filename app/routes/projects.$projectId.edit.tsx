import { ProjectForm } from "../core/components/ProjectForm";
import { validator } from "./projects.create";
import {
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Paper,
} from "@mui/material";
import type {
  ActionFunction,
  LoaderFunctionArgs,
  MetaFunction,
} from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { Form } from "@remix-run/react";
import MarkdownStyles from "@uiw/react-markdown-preview/markdown.css";
import MDEditorStyles from "@uiw/react-md-editor/markdown-editor.css";
import { useState } from "react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import GoBack from "~/core/components/GoBack";
import Header from "~/core/layouts/Header";
import { checkPermission } from "~/models/authorization.server";
import type { Roles } from "~/models/authorization.server";
import { getInnovationTiers } from "~/models/innovationTier.server";
import { getProject, updateProjects } from "~/models/project.server";
import { getProjectStatuses } from "~/models/status.server";
import { requireProfile, requireUser } from "~/session.server";

export function links() {
  return [
    { rel: "stylesheet", href: MDEditorStyles },
    { rel: "stylesheet", href: MarkdownStyles },
  ];
}

export const loader = async ({ request, params }: LoaderFunctionArgs) => {
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
  const profileId = profile.id;
  const canDeleteProject = checkPermission(
    profileId,
    user.role as Roles,
    "delete",
    "project",
    project
  );

  return typedjson({
    profile,
    project,
    profileId,
    projectId,
    statuses,
    tiers,
    canDeleteProject,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  // Validate permissions
  const user = await requireUser(request);
  const profile = await requireProfile(request);
  const currentProject = await getProject({ id: projectId });
  if (
    !checkPermission(
      profile.id,
      user.role as Roles,
      "edit",
      "project",
      currentProject
    )
  ) {
    throw new Error("You don't have permission to perform this operation");
  }

  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);
  const project = await updateProjects(projectId, result.data);
  return redirect(`/projects/${project.id}`);
};

export const meta: MetaFunction<typeof loader> = ({ data, params }) => {
  if (!data) {
    return [
      { title: "Missing Project" },
      {
        name: "description",
        content: `There is no Project with the ID of ${params.projectId}. 😢`,
      },
    ];
  }

  const { project } = data;
  return [
    { title: `${project?.name} | edit project` },
    { name: "description", content: project?.description },
  ];
};

export default function EditProjectPage() {
  const { project, projectId, statuses, tiers, canDeleteProject } =
    useTypedLoaderData<typeof loader>();

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

          <ValidatedForm
            validator={validator}
            defaultValues={{
              name: project.name,
              status: project.status || "",
              tierName: project.tierName || "",
              description: project.description || "",
              valueStatement: project.valueStatement || "",
              helpWanted: project.helpWanted,
              disciplines: project.disciplines,
              ownerId: project.ownerId || "",
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
          {canDeleteProject ? (
            <Button
              onClick={handleClickOpen}
              color="warning"
              variant="contained"
            >
              {"Delete Project"}
            </Button>
          ) : null}
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
