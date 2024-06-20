import { Chip } from "@mui/material";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import "instantsearch.css/themes/satellite.css";
import { connectHits } from "react-instantsearch-core";

interface SearchProjectsOutput {
  sort: number;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  preferredName: string;
  lastName: string;
  avatarUrl: string;
  status: string;
  color?: string;
  searchSkills?: { name: string }[];
  votesCount: number;
  projectMembers: number;
  owner?: string;
  tierName?: string;
  latest_pmw: boolean;
  resourcesCount?: number;
}

interface HitProps {
  hits: SearchProjectsOutput[];
}

function TableHits({ hits }: HitProps) {
  return hits.map((hit) => {
    return (
      <TableRow key={hit.sort - 1}>
        <TableCell>
          <a
            href={`/projects/${hit.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {hit.name}
          </a>
        </TableCell>
        <TableCell>
          <Chip
            component="a"
            href={`/projects?tier=${hit.tierName}`}
            clickable
            rel="noreferrer"
            label={hit.tierName}
          />
        </TableCell>
        <TableCell>
          <a
            href={`/projects/${hit.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {hit.status}
          </a>
        </TableCell>
        <TableCell>{hit.projectMembers}</TableCell>
        <TableCell>{hit.votesCount}</TableCell>
        <TableCell>
          <a
            href={`/projects/${hit.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {"Code"}
          </a>
        </TableCell>
        <TableCell>{hit.resourcesCount}</TableCell>
      </TableRow>
    );
  });
}

export default connectHits(TableHits);
