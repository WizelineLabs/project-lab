import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import {
  getProjectTeamMember,
  isProjectTeamMember,
  getProject,
  updateRelatedProjects,
} from "~/models/project.server";
import type { ProjectComplete } from "~/models/project.server";
import { getProjects } from "~/models/project.server";
import { adminRoleName } from "app/constants";
import type { Profiles, ProjectMembers } from "@prisma/client";

import {
  Autocomplete,
  TextField,
  Alert,
  Box,
  Tabs
} from "@mui/material";
import GoBack from "~/core/components/GoBack";
import RelatedProjectsSection from "~/core/components/RelatedProjectsSection";
import { SyntheticEvent, useEffect, useState } from "react";
import { ProjectForm } from "../components/ProjectForm";
import { ValidatedForm } from "remix-validated-form";
import { validator } from "../create";
import Header from "~/core/layouts/Header";
import { EditPanelsStyles } from "~/routes/manager/manager.styles";
import { TabStyles } from "../components/Styles/TabStyles.component";
import TabPanel from "~/core/components/TabPanel";

type LoaderData = {
  isAdmin: boolean;
  isTeamMember: boolean;
  membership: ProjectMembers | undefined;
  profile: Profiles;
  project: ProjectComplete;
  profileId: string;
  projectId: string;
  projectsList: { id: string; name: string }[];
};

export const loader: LoaderFunction = async ({ request, params }) => {
  invariant(params.editProjectId, "projectId could not be found");
  const projectId = params.editProjectId;
  const project = await getProject({ id: projectId });
  if (!project) {
    throw new Response("Not Found", { status: 404 });
  }

  const projects = await getProjects({});
  const projectsList = projects.map((e) => {
    return { id: e.id, name: e.name };
  });

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
    projectsList,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action") as string;
  try {
    switch (action) {
      case "EDIT":
        const projectId = form.get("projectId") as string;
        const relatedProjectsParse = JSON.parse(
          form.get("relatedProjects") as string
        );
        await updateRelatedProjects({
          id: projectId,
          data: { relatedProjects: relatedProjectsParse },
        });
        return json({ error: "" }, { status: 200 });
      default: {
        throw new Error(`Something went wrong, ${action}`);
      }
    }
  } catch (error: any) {
    throw error;
  }
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
  const fetcher = useFetcher();
  const {
    isAdmin,
    isTeamMember,
    profile,
    membership,
    project,
    profileId,
    projectId,
    projectsList,
  } = useLoaderData() as LoaderData;

  const [selectedRelatedProjects, setSelectedRelatedProjects] = useState(
    project.relatedProjects
  );
  const [error, setError] = useState<string>("");
  
  const [tabIndex, setTabIndex] = useState(0)
  const handleTabChange = (event: SyntheticEvent, tabNumber: number) => setTabIndex(tabNumber)
  
  const handleChange = (v: any) => {
    setSelectedRelatedProjects(() => v);
  };

  const submitEdition = async () => {
    try {
      const body = {
        ...fetcher.data,
        projectId,
        relatedProjects: JSON.stringify(selectedRelatedProjects),
        action: "EDIT",
      };
      await fetcher.submit(body, { method: "put" });
    } catch (error: any) {
      console.error(error);
    }  
  };

  useEffect(() => {
    //It handles the fetcher error from the response
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.error) {
        setError(fetcher.data.error);
      } else {
        setError("");
      }
    }
  }, [fetcher]);
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
            <Tabs value={tabIndex} onChange={handleTabChange} aria-label="Edit project">
              <TabStyles label="Project Details" />
              <TabStyles label="Contributor's Path" />
            </Tabs>
          </Box>

          <TabPanel value={tabIndex} index={0}>
            <ValidatedForm
              validator={validator}
              defaultValues={{
                name: project.name,
                description: project.description,
                valueStatement: project.valueStatement,
                helpWanted: project.helpWanted,
                disciplines: project.disciplines,
                owner: project.owner,
                target: project.target,
                repoUrls: project.repoUrls,
                slackChannel: project.slackChannel,
                skills: project.skills,
                labels: project.labels,
                projectMembers: project.projectMembers,
              }}
              method="post"
            >
              <ProjectForm submitText="Update Project"/>
              <Box textAlign="center">
                <button type="submit" className="primary">
                  {"Update Project"}
                </button>
              </Box>
            </ValidatedForm>
          </TabPanel>
          {/*<TabPanel value={tabIndex} index={1}>
            <ProjectContributorsPathForm
              submitText="Update Stages "
              schema={ContributorPath}
              initialValues={project.stages}
              onSubmit={handleSubmitContributorPath}
              projectId={project.id}
              retrieveProjectInfo={retrieveProjectInfo}/>
           </TabPanel>*/}
        </EditPanelsStyles>
      </div>
      <div className="wrapper form__center-text">
        <button type="submit" className="primary">
          {"Delete Project"}
        </button>
      </div>
      {error && <Alert severity="warning">Information could not be saved</Alert>}
    </>
  )
}
