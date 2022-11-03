import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useLoaderData, useFetcher } from "@remix-run/react";
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
  Chip,
  Box,
  Autocomplete,
  TextField,
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

// ACTION
export const action: ActionFunction = async ({ request }) => {
  const form = await request.formData();
  const action = form.get("action") as string;
  console.log("SUBMIT STARTS");
  console.log(...form);
  try {
    switch (action) {
      case "EDIT":
        console.log(...form);
        const projectId = form.get("projectId") as string;
        const relatedProjectsParse = JSON.parse(
          form.get("relatedProjects") as string
        );
        const relatedProjectsIds = relatedProjectsParse.map((e: any) => e.id);
        console.log("the data ids", relatedProjectsIds);
        const response = await updateRelatedProjects({
          id: projectId,
          data: { relatedProjects: relatedProjectsParse },
        });
        console.log(response);
        // return redirect(`/projects/${projectId}`);
        console.log("INFO WAS SAVED");
        return json({ error: "All good" }, { status: 200 });
      default: {
        throw new Error(`Something went wrong, ${action}`);
      }
    }
  } catch (error: any) {
    throw error;
  }
};

//META
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
    console.log("Handle the change");
  };

  const submitEdition = async () => {
    try {
      const body = {
        ...fetcher.data,
        projectId,
        // ...project,
        relatedProjects: JSON.stringify(selectedRelatedProjects),
        action: "EDIT",
        // name: "Other name",
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
            onChange={(event: any, newValue: string[] | null) =>
              handleChange(newValue)
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
        </fetcher.Form>
      </div>
      <div className="wrapper">
        <RelatedProjectsSection relatedProjects={project.relatedProjects} />
      </div>

    </>
  );
}
