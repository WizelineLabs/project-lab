import { Link } from "@remix-run/react"
import {
    Chip,
    Box,
  } from "@mui/material";
  interface IProps {
    relatedProjects: any[]
    allowEdit: Boolean
  }

function RelatedProjectsSection({relatedProjects, allowEdit}: IProps) {
    return (
    <>
    <big>Related Projects</big>
      {allowEdit && 
      <div><p>Edit Button</p></div>}
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