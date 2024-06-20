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
  Paper,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import { useState } from "react";
import {
  InstantSearch,
  SearchBox,
  Pagination,
  Configure,
} from "react-instantsearch-dom";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { mentorDiscipline } from "~/constants";
import HitApplicants from "~/core/components/HitsInstantSearch/ProjectApplicantHits";
import TableHitsApplicant from "~/core/components/HitsInstantSearch/TableHitsApplicant";
import { existApplicant, getApplicantByEmail } from "~/models/applicant.server";
import { searchDisciplineByName } from "~/models/discipline.server";
import { getProjectsByRole } from "~/models/project.server";
import { requireProfile } from "~/session.server";

function getTitle() {
  return "All Projects";
}

export const TYPESENSE_SERVER_CONFIG = {
  apiKey: "123",
  nodes: [
    {
      host: "localhost",
      port: 8108,
      protocol: "http",
    },
  ],
  connectionTimeoutSeconds: 3,
  numRetries: 8,
};
export const typesenseAdapter = new TypesenseInstantsearchAdapter({
  server: TYPESENSE_SERVER_CONFIG,
  additionalSearchParameters: {
    query_by: "name,description",
    numTypos: "3",
    typoTokensThreshold: 1,
  },
});

export const searchClient = typesenseAdapter.searchClient;

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
  const { count, existApplicant, applicant } = useLoaderData<typeof loader>();
  const [searchParams] = useSearchParams();

  const viewOption = searchParams.get("view") || "card";

  const replaceFilterUrl = (filter: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(filter, value);
    return `?${newParams.toString()}`;
  };

  const [searchValue, setSearchValue] = useState("");
  return (
    <>
      <Header
        title="Projects"
        onSearch={setSearchValue}
        existApplicant={existApplicant}
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
            <InstantSearch indexName="projects" searchClient={searchClient}>
              <Configure filters={`latest_pmw:true`} />
              <div hidden>
                <SearchBox defaultRefinement={searchValue} />
              </div>
              <Grid container spacing={3}>
                <HitApplicants />
              </Grid>
              <Pagination />
            </InstantSearch>
          ) : (
            <Table size="small">
              <TableHead>
                <TableRow>
                  <TableCell>Name</TableCell>
                  <TableCell>Skills</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                <InstantSearch indexName="projects" searchClient={searchClient}>
                  <Configure filters={`latest_pmw:true`} />
                  <div hidden>
                    <SearchBox defaultRefinement={searchValue} />
                  </div>
                  <TableHitsApplicant />
                  <Pagination />
                </InstantSearch>
              </TableBody>
            </Table>
          )}
        </Paper>
      </Grid>
    </>
  );
}
