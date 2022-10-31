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
import { getProjects } from "~/models/project.server";
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
    Autocomplete,
    TextField,
  } from "@mui/material";
import { useState } from "react";

type LoaderData = {
    isAdmin: boolean;
    isTeamMember: boolean;
    membership: ProjectMembers | undefined;
    profile: Profiles;
    project: ProjectComplete;
    profileId: string;
    projectId: string;
    projectsList: {id: string,name:string}[];
  };

export const loader:LoaderFunction = async ({request, params}) => {
    invariant(params.editProjectId, "projectId could not be found");
    const projectId = params.editProjectId;
    const project = await getProject({ id: projectId });
    if (!project) {
      throw new Response("Not Found", { status: 404 });
    }

    const projects = await getProjects({});
    const projectsList = projects.map((e) => {
      return { id:e.id, name:e.name }
    })
  
    const user = await requireUser(request);
    const profile = await requireProfile(request);
    const isTeamMember = isProjectTeamMember(profile.id, project);
  
    const membership = getProjectTeamMember(profile.id, project);
    const isAdmin = user.role == adminRoleName;
    const profileId = profile.id;
    console.log("The loader does work")
    return json<LoaderData>({
        isAdmin,
        isTeamMember,
        membership,
        profile,
        project,
        profileId,
        projectId,
        projectsList
      });    
}

// ACTION
export const action:ActionFunction = async ({request}) => {
  const form = await request.formData();
  try {
      console.log(...form)
      // console.log(selectedOptions)
    // switch (action) {
    //   case "EDIT_PROJECT":
    //     const info = form.getAll();
    //     console.log(info)

        return json({ error: "" }, { status: 200 });
    //   default: {
    //     throw new Error("Something went wrong");
    //   }
    // }
  } catch (error: any) {
    throw error;
  }  
}

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
    const {isAdmin, isTeamMember, profile, membership, project, profileId ,projectId, projectsList} = useLoaderData() as LoaderData

    const handleChange = () => {
      console.log("Handle the change")
    }
    console.log("the thing with the stuff");
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

            <div>
              <h2>lista de projectos</h2>
              <p>
                {JSON.stringify(projectsList,null,2)}
              </p>
            </div>

            <form method="POST" name="theInfo">
            <Autocomplete
        multiple
        id="relatedProjects"
        options={projectsList}
        getOptionLabel={(option) => option.name}
        onChange={handleChange}
        defaultValue={project.relatedProjects}
        filterSelectedOptions
        isOptionEqualToValue={(option, value) => option.name === value.name}
        // value={project.relatedProjects}
        renderInput={(params) => (
          <TextField
          label="relatedProjects"
          name="relatedProjects"
            {...params}
            placeholder="Related Projects"
          />
        )}
      />
      <label htmlFor="nameTest">
        Name
      <input type="text" name="nameTest" />
      </label>

      <label htmlFor="cartItem">
        Items
        <input type="text" name="cartItem[]" />
        <input type="text" name="cartItem[]" />
        <input type="text" name="cartItem[]" />
      </label>      
      <button className="primary" type="submit">SAVE</button>
      </form>
        </div>
    )
}