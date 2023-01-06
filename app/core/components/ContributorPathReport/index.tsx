import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import CheckBoxSharpIcon from "@mui/icons-material/CheckBoxSharp";
import CheckBoxOutlineBlankSharpIcon from "@mui/icons-material/CheckBoxOutlineBlankSharp";
import EditSharp from "@mui/icons-material/EditSharp";

import {
  CompleteIcon,
  IncompleteIcon,
  TipBubble,
  HtmlTooltip,
} from "./ContributorPathReport.styles";

import type {
  ContributorPath,
  ProjectMember,
  ProjectTask,
  Stage,
} from "~/core/interfaces/ContributorPathReport";
import { Grid, IconButton } from "@mui/material";

interface IProps {
  project: any;
  isTeamMember: boolean;
  isAdmin: boolean;
}

export const ContributorPathReport = ({
  project,
  isTeamMember,
  isAdmin,
}: IProps) => {
  return (
    <>
      <Grid container justifyContent="space-between" alignItems="flext-start">
        <big>
          Contributors (
          {
            project.projectMembers?.filter((member: ProjectMember) => {
              return member.active;
            }).length
          }{" "}
          active)
        </big>
        {(isTeamMember || isAdmin) && (
          <IconButton
            aria-label="Edit"
            href={`/projects/${project.id}/members`}
          >
            <EditSharp />
          </IconButton>
        )}
      </Grid>
     
    </>
  );
};

export default ContributorPathReport;
