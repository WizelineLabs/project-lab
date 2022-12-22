import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json, redirect } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import {
  getProjectTeamMember,
  isProjectTeamMember,
  getProject,
  updateRelatedProjects,
  updateProjects,
} from "~/models/project.server";
import type { ProjectComplete } from "~/models/project.server";
import { adminRoleName } from "app/constants";
import type {
  InnovationTiers,
  Profiles,
  ProjectMembers,
  ProjectStatus,
} from "@prisma/client";

import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Tabs,
} from "@mui/material";
import GoBack from "~/core/components/GoBack";
import RelatedProjectsSection from "~/core/components/RelatedProjectsSection";
import type { SyntheticEvent } from "react";
import { useState } from "react";
import { ProjectForm } from "../components/ProjectForm";
import { ValidatedForm, validationError } from "remix-validated-form";
import { validator } from "../create";
import Header from "~/core/layouts/Header";
import { EditPanelsStyles } from "~/routes/manager/manager.styles";
import { TabStyles } from "../components/Styles/TabStyles.component";
import TabPanel from "~/core/components/TabPanel";
import { getProjectStatuses } from "~/models/status.server";
import { getInnovationTiers } from "~/models/innovationTier.server";

type LoaderData = {
  isAdmin: boolean;
  isTeamMember: boolean;
  membership: ProjectMembers | undefined;
  profile: Profiles;
  project: ProjectComplete;
  profileId: string;
  projectId: string;
  statuses: ProjectStatus[];
  tiers: InnovationTiers[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
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

  const membership = getProjectTeamMember(profile.id, project);
  const isAdmin = user.role == adminRoleName;
  const profileId = profile.id;
  return json<LoaderData>({
    isAdmin,
    isTeamMember,
    membership,
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
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);
  const project = await updateProjects(projectId, isAdmin, result.data);
  return redirect(`/projects/${project.id}`);
};

export const meta: MetaFunction = ({ data, params }) => {
  if (!data) {
    return {
      title: "Missing Project",
      description: `There is no Project with the ID of ${params.projectId}. 😢`,
    };
  }

  const { project } = data as LoaderData;
  return {
    title: `${project?.name} edit project`,
    description: project?.description,
  };
};

export default function EditProjectPage() {
  const {
    isAdmin,
    isTeamMember,
    profile,
    membership,
    project,
    profileId,
    projectId,
    statuses,
    tiers,
  } = useLoaderData() as LoaderData;

  const [selectedRelatedProjects, setSelectedRelatedProjects] = useState(
    project.relatedProjects
  );
  const [tabIndex, setTabIndex] = useState(0);
  const handleTabChange = (event: SyntheticEvent, tabNumber: number) =>
    setTabIndex(tabNumber);

  const [open, setOpen] = useState(false);
  const [deleteSelection, setDeleteSelection] = useState("");
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

      <div className="wrapper">
        <h1 className="form__center-text">Edit {project.name}</h1>
      </div>

      <div className="wrapper">
        <GoBack title="Back to project" href={`/projects/${projectId}`} />

        <EditPanelsStyles>
          <Box>
            <Tabs
              value={tabIndex}
              onChange={handleTabChange}
              aria-label="Edit project"
            >
              <TabStyles label="Project Details" />
              <TabStyles label="Contributor's Path" />
            </Tabs>
          </Box>

          <TabPanel value={tabIndex} index={0}>
            {/* <ValidatedForm
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
                skills: project.skills,
                labels: project.labels,
                //projectMembers: project.projectMembers,
              }}
              method="post"
            >
              <ProjectForm statuses={statuses} tiers={tiers} />
            </ValidatedForm> */}
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            {/* <ProjectContributorsPathForm
              submitText="Update Stages "
              schema={ContributorPath}
              initialValues={project.stages}
              onSubmit={handleSubmitContributorPath}
              projectId={project.id}
              retrieveProjectInfo={retrieveProjectInfo}
            /> */}
          </TabPanel>
        </EditPanelsStyles>
      </div>
      <div className="wrapper form__center-text">
        <button onClick={handleClickOpen} className="primary warning">
          {"Delete Project"}
        </button>
      </div>
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
            <Button className="primary" onClick={handleClose}>
              Cancel
            </Button>
            <Button
              disabled={isButtonDisabled}
              type="submit"
              className="primary warning"
            >
              Yes, delete it
            </Button>
          </DialogActions>
        </Form>
      </Dialog>
    </>
  );
}
