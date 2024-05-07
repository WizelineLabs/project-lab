import ProposalCard from "../ProposalCard";
import { Grid } from "@mui/material";
import "instantsearch.css/themes/satellite.css";
import { connectHits } from "react-instantsearch-core";

const initials = (preferredName: string, lastName: string) => {
  return preferredName.substring(0, 1) + lastName.substring(0, 1);
};

interface SearchProjectsOutput {
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

function HitApplicants({ hits }: HitProps) {
  return hits.map((hit, i) => {
    const skillsname = hit.searchSkills?.map((skillName: any) => ({
      name: skillName.name,
    }));

    return (
      <>
        <Grid item xs={12} sm={6} lg={4} key={i}>
          <ProposalCard
            id={hit.id}
            title={hit.name}
            picture={hit.avatarUrl}
            initials={initials(hit.preferredName, hit.lastName)}
            date={new Intl.DateTimeFormat([], {
              year: "numeric",
              month: "long",
              day: "2-digit",
            }).format(new Date(hit.createdAt))}
            description={hit.description}
            status={hit.status}
            skills={skillsname}
            color={hit.color}
            votesCount={Number(hit.votesCount)}
            tierName={hit.tierName}
            projectMembers={Number(hit.projectMembers)}
          />
        </Grid>
      </>
    );
  });
}

export default connectHits(HitApplicants);
