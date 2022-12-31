import { Chip, Box } from "@mui/material";
import Link from "./Link";
interface IProps {
  relatedProjects: any[];
}

function RelatedProjectsSection({ relatedProjects }: IProps) {
  return (
    <>
      <big>Related Projects</big>
      <Box>
        {relatedProjects.map((item, i) => {
          return (
            <Link className="link_button" key={i} to={`/projects/${item.id}`}>
              <Chip
                className="chip-hover"
                sx={{ margin: "1em .5em" }}
                label={item?.name}
              ></Chip>
            </Link>
          );
        })}
      </Box>
    </>
  );
}

export default RelatedProjectsSection;
