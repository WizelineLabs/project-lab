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
import { Box, Grid, IconButton, Paper } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useEffect, useState } from "react";

interface IProps {
  project: any;
  isTeamMember: boolean;
  isAdmin: boolean;
}

type ContributiorRecord = {
  id: number;
  active: string;
  name: string;
  role: [];
  skills: [];
  hpw: string;
  intro: [];
  setup: [];
  quickwin: [];
  majorcontributor: [];
};

export const ContributorPathReport = ({
  project,
  isTeamMember,
  isAdmin,
}: IProps) => {
  const [rows, setRows] = useState<ContributiorRecord[]>([]);

  useEffect(() => {
    const tableRows: ContributiorRecord[] = project.projectMembers?.map(
      (member: ProjectMember, memberIndex: number) => {
        return {
          id: memberIndex,
          active: member.active
            ? "<CompleteIcon><CheckSharpIcon /> </CompleteIcon>"
            : "Inactive",
          name: member.profile?.firstName + " " + member.profile?.lastName,
          role: member.role.map((role) => role.name),
          skill: member.practicedSkills.map((skill) => skill.name),
          hpw: member.hoursPerWeek,
          intro: [],
          setup: [],
          quickwin: [],
          majorcontributor: [],
        };
      }
    );

    setRows(tableRows);
  }, [project]);

  const columns: GridColDef[] = [
    {
      field: "active",
      headerName: "Active",
      width: 70,
      renderCell: (cellValues: any) => {
        return cellValues.value === "Inactive" ? (
          <IncompleteIcon>
            <ClearSharpIcon />
          </IncompleteIcon>
        ) : (
          <CompleteIcon>
            <CheckSharpIcon />
          </CompleteIcon>
        );
      },
    },
    { field: "name", headerName: "Name", flex: 1 },
    { field: "role", headerName: "Role(s)", flex: 1 },
    { field: "skill", headerName: "Skills", flex: 1 },
    { field: "hpw", headerName: "H.P.W", width: 80 },
    { field: "intro", headerName: "Intro", flex: 1 },
    { field: "setup", headerName: "Setup", flex: 1 },
    { field: "quickwin", headerName: "Quicl Win", flex: 1 },
    { field: "majorcontributor", headerName: "Major Contributor", flex: 1 },
  ];
  return (
    <Paper sx={{ padding: 2, marginBottom: 2 }}>
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
      <Box sx={{ height: 500, width: "100%" }}>
        <DataGrid
          rows={rows}
          columns={columns}
          pageSize={10}
          rowsPerPageOptions={[10]}
          disableSelectionOnClick
          experimentalFeatures={{ newEditingApi: true }}
        />
      </Box>
    </Paper>
  );
};

export default ContributorPathReport;
