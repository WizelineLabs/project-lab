import CheckSharpIcon from "@mui/icons-material/CheckSharp";
import ClearSharpIcon from "@mui/icons-material/ClearSharp";
import EditSharp from "@mui/icons-material/EditSharp";
import { CompleteIcon, IncompleteIcon } from "./ContributorPathReport.styles";

import type { ProjectMember } from "~/core/interfaces/ContributorPathReport";
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
  TableSortLabel,
} from "@mui/material";
import { useEffect, useState } from "react";

interface IProps {
  project: any;
  isTeamMember: boolean;
  isAdmin: boolean;
}

type ContributiorRecord = {
  id: number;
  status: boolean;
  name: string;
  email: string;
  role: [];
  skills: [];
  hpw: string;
  intro: [];
  setup: [];
  quickwin: [];
  majorcontributor: [];
};

function stableSort<T>(
  array: readonly T[],
  comparator: (a: T, b: T) => number
) {
  const stabilizedThis = array.map((el, index) => [el, index] as [T, number]);
  stabilizedThis.sort((a, b) => {
    const order = comparator(a[0], b[0]);
    if (order !== 0) {
      return order;
    }
    return a[1] - b[1];
  });
  return stabilizedThis.map((el) => el[0]);
}

function descendingComparator<T>(a: T, b: T, orderBy: keyof T) {
  if (b[orderBy] < a[orderBy]) {
    return -1;
  }
  if (b[orderBy] > a[orderBy]) {
    return 1;
  }
  return 0;
}

type Order = "asc" | "desc";

function getComparator<Key extends keyof any>(
  order: Order,
  orderBy: Key
): (
  a: { [key in Key]: number | string | [] | boolean },
  b: { [key in Key]: number | string | [] | boolean }
) => number {
  return order === "desc"
    ? (a, b) => descendingComparator(a, b, orderBy)
    : (a, b) => -descendingComparator(a, b, orderBy);
}

export const ContributorPathReport = ({
  project,
  isTeamMember,
  isAdmin,
}: IProps) => {
  const [rows, setRows] = useState<ContributiorRecord[]>([]);
  const page: number = 0;
  const rowsPerPage: number = 25;
  const [orderBy, setOrderBy] = useState<keyof ContributiorRecord>("status");
  const [order, setOrder] = useState<Order>("asc");

  useEffect(() => {
    const tableRows: ContributiorRecord[] = project.projectMembers?.map(
      (member: ProjectMember, memberIndex: number) => {
        return {
          id: memberIndex,
          status: member.active,
          name: member.profile?.firstName + " " + member.profile?.lastName,
          email: member.profile?.email,
          role: member.role.map((role) => role.name),
          skills: member.practicedSkills.map((skill) => " " + skill.name),
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

  interface HeadContributorData {
    id: keyof ContributiorRecord;
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
    {
      id: "intro",
      numeric: false,
      label: "Intro",
    },
    {
      id: "setup",
      numeric: false,
      label: "Setup",
    },
    {
      id: "quickwin",
      numeric: false,
      label: "Quick Win",
    },
    {
      id: "majorcontributor",
      numeric: false,
      label: "Major Contributor",
    },
  ];

  const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - rows.length) : 0;

  const createSortHandler =
    (property: keyof ContributiorRecord) =>
    (event: React.MouseEvent<unknown>) => {
      const isAsc = orderBy === property && order === "asc";
      setOrder(isAsc ? "desc" : "asc");
      setOrderBy(property);
    };

  return (
    <Card>
      <CardHeader
        title="Contributors"
        action={
          (isTeamMember || isAdmin) && (
            <IconButton
              aria-label="Edit"
              href={`/projects/${project.id}/members`}
            >
              <EditSharp />
            </IconButton>
          )
        }
      />
      <CardContent>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow>
                {headCells.map((cell) => (
                  <TableCell key={cell.id} align="center" padding="normal">
                    <TableSortLabel
                      active={orderBy === cell.id}
                      direction={orderBy === cell.id ? order : "asc"}
                      onClick={createSortHandler(cell.id)}
                    >
                      {cell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {stableSort(rows, getComparator(order, orderBy))
                .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                .map((row, index) => {
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
                        {row.status ? (
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
                        <Link href={`mailto:${row.email}`}>{row.name}</Link>
                      </TableCell>
                      <TableCell align="center">{row.role}</TableCell>
                      <TableCell align="center">
                        <Grid
                          container
                          spacing={1}
                          rowSpacing={1}
                          columnSpacing={2}
                        >
                          {row.skills?.map((skill, id) => {
                            return (
                              <Grid item xs={12} md={6} key={id}>
                                {skill}
                              </Grid>
                            );
                          })}
                        </Grid>
                      </TableCell>
                      <TableCell align="center">{row.hpw}</TableCell>
                      <TableCell align="center">{row.intro}</TableCell>
                      <TableCell align="center">{row.setup}</TableCell>
                      <TableCell align="center">{row.quickwin}</TableCell>
                      <TableCell align="center">
                        {row.majorcontributor}
                      </TableCell>
                    </TableRow>
                  );
                })}
              {emptyRows > 0 && (
                <TableRow>
                  <TableCell colSpan={6} />
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </CardContent>
    </Card>
  );
};

export default ContributorPathReport;
