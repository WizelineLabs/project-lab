import { CompleteIcon, IncompleteIcon } from "./ContributorPathReport.styles";
import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import EditSharp from "@mui/icons-material/EditSharp";
import {
  Card,
  CardContent,
  CardHeader,
  Grid,
  IconButton,
  Link,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Chip,
} from "@mui/material";
import type { ProjectComplete, ProjectMembers } from "~/models/project.server";

interface IProps {
  project: ProjectComplete;
  projectMembers: ProjectMembers;
  canEditProject: boolean;
}

export const ContributorPathReport = ({
  project,
  projectMembers,
  canEditProject,
}: IProps) => {
  interface HeadContributorData {
    id: string;
    label: string;
    numeric: boolean;
  }

  const headCells: HeadContributorData[] = [
    {
      id: "status",
      numeric: false,
      label: "Active",
    },
    {
      id: "name",
      numeric: false,
      label: "Name",
    },
    {
      id: "role",
      numeric: false,
      label: "Role(s)",
    },
    {
      id: "skills",
      numeric: false,
      label: "Skills",
    },
    {
      id: "hpw",
      numeric: true,
      label: "H.P.W.",
    },
  ];

  return (
    <Card>
      <CardHeader
        title="Contributors"
        action={
          canEditProject ? (
            <IconButton
              aria-label="Edit"
              href={`/projects/${project.id}/members`}
            >
              <EditSharp />
            </IconButton>
          ) : null
        }
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((cell) => (
                  <TableCell key={cell.id} align="center" padding="normal">
                    {cell.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {projectMembers.map((row, index) => {
                const labelId = `enhanced-table-checkbox-${index}`;

                return (
                  <TableRow hover tabIndex={0} key={index}>
                    <TableCell
                      component="th"
                      id={labelId}
                      scope="row"
                      padding="none"
                      align="center"
                    >
                      {row.active ? (
                        <CompleteIcon>
                          <CheckSharpIcon />
                        </CompleteIcon>
                      ) : (
                        <IncompleteIcon>
                          <ClearSharpIcon />
                        </IncompleteIcon>
                      )}
                    </TableCell>
                    <TableCell align="center">
                      <Button
                        component={Link}
                        href={`/profile/${encodeURIComponent(row.email)}`}
                      >
                        {`${row.preferredName} ${row.lastName}`}
                      </Button>
                    </TableCell>
                    <TableCell align="left" sx={{ width: "" }}>
                      {row.role.map((item, index) => (
                        <Chip
                          key={index}
                          component="a"
                          href={`/projects?role=${item}`}
                          clickable
                          label={item.name}
                          sx={{ marginRight: 1, marginBottom: 1 }}
                        />
                      ))}
                    </TableCell>
                    <TableCell align="center">
                      <Grid
                        container
                        spacing={1}
                        rowSpacing={1}
                        columnSpacing={2}
                      >
                        {row.practicedSkills?.map((skill, id) => {
                          return (
                            <Grid item xs={12} md={6} key={id}>
                              {skill.name}
                            </Grid>
                          );
                        })}
                      </Grid>
                    </TableCell>
                    <TableCell align="center">{row.hoursPerWeek}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ContributorPathReport;
