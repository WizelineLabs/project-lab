import { Grid, IconButton, Pagination, Paper } from "@mui/material";
import Header from "../../core/layouts/Header";
import ProposalCard from "../../core/components/ProposalCard";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { getProjectsByRole } from "~/models/project.server";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import { searchDisciplineName } from "~/models/discipline.server";

const ITEMS_PER_PAGE = 10;

function getTitle() {
  return "All Projects";
}

export const loader: LoaderFunction = async ({ request }) => {
  const id = await searchDisciplineName("Mentor");
  const { projects, count } = await getProjectsByRole(id?.id as string);

  return {
    projects,
    count,
    id,
  };
};

export default function ViewProjects() {
  const { projects, count } = useLoaderData();

  const [searchParams, setSearchParams] = useSearchParams();

  const viewOption = searchParams.get("view") || "card";

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    searchParams.set("page", String(value - 1));
    setSearchParams(searchParams);
  };

  const replaceFilterUrl = (filter: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(filter, value);
    return `?${newParams.toString()}`;
  };

  return (
    <>
      <Header title="Intership Projects" />
      <Grid item xs={12} md={9}>
        <Paper elevation={0} sx={{ padding: 2, margin: 2 }}>
          <h2 style={{ marginTop: 0 }}>{getTitle() + ` (${count || 0})`}</h2>
          <IconButton
            href={replaceFilterUrl("view", "card")}
            color={viewOption === "card" ? "primary" : "default"}
          >
            <ViewModuleIcon />
          </IconButton>
          <IconButton
            href={replaceFilterUrl("view", "table")}
            color={viewOption === "table" ? "primary" : "default"}
          >
            <ViewListIcon />
          </IconButton>
          {viewOption === "card" ? (
            <Grid
              container
              spacing={2}
              sx={{ paddingTop: 2, paddingBottom: 2 }}
            >
              {projects.map((item: any, i: number) => (
                <Grid item xs={12} sm={6} lg={4} key={i}>
                  <ProposalCard
                    id={item.id}
                    title={item.name}
                    date={new Intl.DateTimeFormat([], {
                      year: "numeric",
                      month: "long",
                      day: "2-digit",
                    }).format(new Date(item.createdAt))}
                    description={item.description}
                    status={item.status}
                    color={item.color}
                    votesCount={Number(item.votesCount)}
                    skills={item.searchSkills
                      .trim()
                      .split(",")
                      .map((skill: string) => ({ name: skill }))}
                  />
                </Grid>
              ))}
            </Grid>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Skills</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {projects.map((item: any, i: number) => (
                  <TableRow key={i}>
                    <TableCell>
                      <a
                        href={`/internshipProjects/${item.id}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {item.name}
                      </a>
                    </TableCell>
                    <TableCell>
                      <a
                        href={`/internshipProjects/${item.id}`}
                        style={{ color: "inherit", textDecoration: "none" }}
                      >
                        {item.searchSkills}
                      </a>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
          <Pagination
            count={
              count % ITEMS_PER_PAGE === 0
                ? count / ITEMS_PER_PAGE
                : Math.trunc(count / ITEMS_PER_PAGE) + 1
            }
            shape="rounded"
            sx={{ pt: "15px" }}
            onChange={handlePaginationChange}
          />
        </Paper>
      </Grid>
    </>
  );
}
