import { Link } from "@remix-run/react"
import type {
  ActionFunction,
  LoaderFunction,
  MetaFunction,
} from "@remix-run/node";
import { useLoaderData, useFetcher } from "@remix-run/react";
import invariant from "tiny-invariant";
import {
    Chip,
    Box,
  } from "@mui/material";
import { useState } from "react";
import { EditButton } from "~/routes/projects/$projectId.styles";
  interface IProps {
    relatedProjects: any[]
    allowEdit: Boolean
  }

  type loaderData = {
    projectsList: { id: string; name: string }[];
  }

  export const loader: LoaderFunction = async ({request, params} ) => {
    invariant(params.editProject)
  }

function RelatedProjectsSection({relatedProjects, allowEdit}: IProps) {
    const [isEditActive,setIsEditActive] = useState(false)
    const handleChange = (val:Boolean) => setIsEditActive(!isEditActive)
    return (
    <>
    <big>Related Projects</big>
      {allowEdit && 
      (isEditActive) ? (<><EditButton><button onClick={() => handleChange(false)}>Cancel</button></EditButton>
      </>) 
      : (<EditButton><button onClick={() => handleChange(true)}>EDIT</button></EditButton> )}
        <div>
          {
            isEditActive &&
            <h2>Edit Form</h2>
          }
        </div>
    <Box>
      {relatedProjects.map((item, i) => {
          return (
              <Link className="link_button" key={i} to={`/projects/${item.id}`}>
              <Chip className="chip-hover" sx={{ margin: "1em .5em" }}  label={item?.name}></Chip>
            </Link>
        );
    })}
    </Box>
    </>
    )
}


export default RelatedProjectsSection