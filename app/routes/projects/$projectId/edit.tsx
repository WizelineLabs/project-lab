import { ActionFunction, LoaderFunction, MetaFunction, redirect } from "@remix-run/node";
import { json } from "@remix-run/node";
import { useCatch, useLoaderData } from "@remix-run/react";
import type { SyntheticEvent } from "react"
import { useState } from "react"
import invariant from "tiny-invariant";

import { Box, Tabs } from "@mui/material"

import type { Profiles, ProjectMembers } from "@prisma/client";
import { requireProfile, requireUser } from "~/session.server";
import { getProjectTeamMember, isProjectTeamMember, getProject } from "~/models/project.server";
import type { ProjectComplete } from "~/models/project.server";

import { adminRoleName } from "app/constants"
import GoBack from "app/core/layouts/GoBack"
import Header from "app/core/layouts/Header"
import { TabStyles, EditPanelsStyles } from "app/core/components/Styles/TabStyles.component"
import TabPanel from "app/core/components/TabPanel.component"

type LoaderData = {
  isAdmin: boolean;
  isTeamMember: boolean;
  membership: ProjectMembers | undefined;
  profile: Profiles
  project: ProjectComplete;
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId not found");

  const project = await getProject({ id: params.projectId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  const user = await requireUser(request);
  const profile = await requireProfile(request);
  const isTeamMember = isProjectTeamMember(profile.id, project);
  const membership = getProjectTeamMember(profile.id, project);
  const isAdmin = user.role == adminRoleName;
  return json<LoaderData>({
    isAdmin,
    isTeamMember,
    membership,
    profile,
    project,
  });
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
    title: `${project?.name} milkshake`,
    description: project?.description,
  };
};

export const action: ActionFunction = async ({ request }) => {
  const body = await request.formData();
  const project = await createProject(body);
  return redirect(`/projects/${project.id}`);
};

export default function EditProject() {
  const { isAdmin, isTeamMember, profile, membership, project } = useLoaderData() as LoaderData;
  invariant(project, "project not found");

  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event: SyntheticEvent, tabNumber: number) => setTabIndex(tabNumber)

  return (
    <>
      <Header title={"Edit " + project.name} />

      <div className="wrapper">
        <h1 className="form__center-text">Edit {project.name}</h1>
      </div>

      <div className="wrapper">
        <GoBack
          title="Back to project"
          to={`/projects/${project.id}`}
        />

        <EditPanelsStyles>
          <Box>
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Edit project">
              <TabStyles label="Project Details" />
              <TabStyles label="Contributor's Path" />
            </Tabs>
          </Box>
          <TabPanel value={tabIndex} index={0}>
            <form method="post" action={`/projects/${project.id}/edit`}>
              <ProjectForm
                submitText="Update Project"
                schema={FullCreate}
                initialValues={project}
                onSubmit={handleSubmitProjectDetails}
                buttonType="button"
              />
            </form>
          </TabPanel>
          <TabPanel value={tabIndex} index={1}>
            <ProjectContributorsPathForm
              submitText="Update Stages "
              schema={ContributorPath}
              initialValues={project.stages}
              onSubmit={handleSubmitContributorPath}
              projectId={project.id}
              retrieveProjectInfo={retrieveProjectInfo}
            />
          </TabPanel>
        </EditPanelsStyles>
      </div>
      <div className="wrapper form__center-text">
        <DeleteButton
          project={project}
          deleteProjectMutation={deleteProjectMutation}
          router={router}
        />
      </div>
    </>
  )
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Project not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
