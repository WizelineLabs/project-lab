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

function TableHitsApplicant({ hits }: HitProps) {
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
          <a
            href={`/projects/${hit.id}`}
            style={{ color: "inherit", textDecoration: "none" }}
          >
            {"Code"}
          </a>
        </TableCell>
      </TableRow>
    );
  });
}

export default connectHits(TableHitsApplicant);
