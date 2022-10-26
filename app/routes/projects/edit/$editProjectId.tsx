import type {
    ActionFunction,
    LoaderFunction,
    MetaFunction,
  } from "@remix-run/node";
import { json } from "@remix-run/node";
import { Link, useCatch, useLoaderData, useFetcher } from "@remix-run/react";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import {
  getProjectTeamMember,
  isProjectTeamMember,
  getProject,
} from "~/models/project.server";
import type { ProjectComplete } from "~/models/project.server";
import { adminRoleName } from "app/constants";
import type { Profiles, ProjectMembers } from "@prisma/client";

import {
    Card,
    CardContent,
    Chip,
    Stack,
    Grid,
    Box,
    Button,
  } from "@mui/material";


type LoaderData = {
    isAdmin: boolean;
    isTeamMember: boolean;
    membership: ProjectMembers | undefined;
    profile: Profiles;
    project: ProjectComplete;
    profileId: string;
    projectId: string;
  };

export const loader:LoaderFunction = async ({request, params}) => {
    invariant(params.editProjectId, "projectId could not be found");
    const projectId = params.editProjectId;
    const project = await getProject({ id: projectId });
    if (!project) {
      throw new Response("Not Found", { status: 404 });
    }
  
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
      });    
}

// ACTION


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
    const {isAdmin, isTeamMember, profile, membership, project, profileId ,projectId} = useLoaderData() as LoaderData
    return(
        <div>
            <h1>Edit Page</h1>
            <Link to={`/projects/${projectId}`}>
            <Button className="primary">return</Button>
            </Link>
            <p>Edit project ID: {projectId}</p>
            <p>Related Projects</p>
            {project.relatedProjects.map((item, i) => {
              return (
                <Link key={i} to={`/projects/${item.id}`}>
                  <p>{item.name}</p>
                </Link>
              )
            })}
            <p>{JSON.stringify(project.relatedProjects,null,2)}</p>
        </div>
    )
}