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
  Alert
} from "@mui/material";
import GoBack from "~/core/components/GoBack";
import RelatedProjectsSection from "~/core/components/RelatedProjectsSection";
import { useEffect, useState } from "react";

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
      <div className="wrapper">
        <h1 className="form__center-text">Edit {project.name}</h1>
      </div>

      <div className="wrapper">
        <GoBack title="Back to project" href={`/projects/${projectId}`} />
        <fetcher.Form method="post">
          <Autocomplete
            multiple
            id="relatedProjects"
            options={projectsList}
            getOptionLabel={(option) => option.name}
            value={selectedRelatedProjects}
            onChange={(event,value: { id: string; name: string; }[] | []) =>
              handleChange(value)
            }
            defaultValue={project.relatedProjects}
            filterSelectedOptions
            isOptionEqualToValue={(option, value) => option.name === value.name}
            renderInput={(params) => (
              <TextField
                label="Related Projects"
                {...params}
                placeholder="Add Related Projects..."
              />
            )}
          />
          <div className="margin-vertical-separator">
          <button
            disabled={fetcher.state === "submitting"}
            className="primary"
            onClick={() => submitEdition()}
            >
            Submit
          </button>
            </div>
            {error && 
            <Alert severity="warning">Information could not be saved</Alert>
            }
        </fetcher.Form>
      </div>
      <div className="wrapper">
        <RelatedProjectsSection relatedProjects={project.relatedProjects} />
      </div>

    </>
  );
}
