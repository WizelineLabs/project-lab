import ProposalCard from "../core/components/ProposalCard";
import Header from "../core/layouts/Header";
import EmailIcon from "@mui/icons-material/EmailRounded";
import FaceIcon from "@mui/icons-material/Face5";
import PhoneIcon from "@mui/icons-material/Phone";
import SportsIcon from "@mui/icons-material/SportsScore";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import WorkIcon from "@mui/icons-material/Work";
import {
  Avatar,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Pagination,
  Paper,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { mentorDiscipline } from "~/constants";
import { existApplicant, getApplicantByEmail } from "~/models/applicant.server";
import { searchDisciplineByName } from "~/models/discipline.server";
import { getProjectsByRole } from "~/models/project.server";
import { requireProfile } from "~/session.server";

const ITEMS_PER_PAGE = 10;

function getTitle() {
  return "All Projects";
}

export const loader: LoaderFunction = async ({ request }) => {
  try {
    const id = await searchDisciplineByName(mentorDiscipline);
    const { projects, count } = await getProjectsByRole(id?.id as string);
    const profile = await requireProfile(request);
    const doesExistApplicant = await existApplicant(profile.email);
    const applicant = await getApplicantByEmail(profile.email);

    return {
      projects,
      count,
      id,
      existApplicant: doesExistApplicant,
      applicant,
    };
  } catch (error) {
    console.error("Error loading data:", error);
    const id = await searchDisciplineByName(mentorDiscipline);
    const { projects, count } = await getProjectsByRole(id?.id as string);

    return {
      projects,
      count,
      id,
      existApplicant: false,
    };
  }
};

export default function ViewProjects() {
  const { projects, count, existApplicant, applicant } =
    useLoaderData<typeof loader>();
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
      <Header
        title="Internship Projects"
        existApplicant={existApplicant}
        applicantId={applicant.id}
      />

      {existApplicant ? (
        <Grid item xs={12} md={9}>
          <Paper elevation={0} sx={{ padding: 2, margin: 2 }}>
            <h2>Personal Information</h2>

            <List
              sx={{ display: "flex", flexWrap: "wrap" }}
              aria-labelledby="nested-list-subheader"
            >
              <ListItem sx={{ flexGrow: 1, width: " 50%", height: "100px" }}>
                <ListItemAvatar>
                  <Avatar>
                    <FaceIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Full Name"
                  secondary={applicant?.fullName}
                />
              </ListItem>

              <ListItem sx={{ flexGrow: 1, width: " 50%", height: "100px" }}>
                <ListItemAvatar>
                  <Avatar>
                    <WorkIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Start Date"
                  secondary={new Date(
                    applicant?.startDate
                  ).toLocaleDateString()}
                />
              </ListItem>

              <ListItem sx={{ flexGrow: 1, width: " 50%", height: "100px" }}>
                <ListItemAvatar>
                  <Avatar>
                    <SportsIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="End Date"
                  secondary={new Date(
                    applicant?.startDate
                  ).toLocaleDateString()}
                />
              </ListItem>

              <ListItem sx={{ flexGrow: 1, width: " 50%", height: "100px" }}>
                <ListItemAvatar>
                  <Avatar>
                    <PhoneIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Contact Phone"
                  secondary={applicant?.phone}
                />
              </ListItem>

              <ListItem sx={{ flexGrow: 1, width: " 50%", height: "100px" }}>
                <ListItemAvatar>
                  <Avatar>
                    <EmailIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary="Email"
                  secondary={applicant?.universityEmail}
                />
              </ListItem>
            </List>
          </Paper>
        </Grid>
      ) : null}
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
