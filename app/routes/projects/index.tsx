import * as React from "react";
import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import ProposalCard from "app/core/components/ProposalCard";
import Header from "app/core/layouts/Header";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
  AppBar,
  Toolbar,
  styled,
  Pagination,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { SortInput } from "app/core/components/SortInput";
import { getProjectMembership, searchProjects } from "~/models/project.server";
import { requireProfile } from "~/session.server";
import type { ProjectStatus } from "~/models/status.server";
import { getProjectStatuses } from "~/models/status.server";
import { ongoingStage, ideaStage } from "~/constants";
import Link from "~/core/components/Link";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import ViewListIcon from "@mui/icons-material/ViewList";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import MembershipModal from "~/core/components/MembershipModal/index";

export interface projectMembership {
  active: boolean;
  createdAt: string;
  hoursPerWeek: number;
  id: string;
  practicedSkills: [
    {
      id: string;
      name: string;
    }
  ];
  profileId: string;
  project: { name: string };
  projectId: string;
  role: [
    {
      id: string;
      name: string;
    }
  ];
  updatedAt: string;
}

type LoaderData = {
  data: Awaited<ReturnType<typeof searchProjects>>;
  ongoingStatuses: ProjectStatus[];
  ideaStatuses: ProjectStatus[];
  projectMembership: projectMembership[];
  message: string;
};

const ITEMS_PER_PAGE = 100;
const FACETS = [
  "status",
  "skill",
  "label",
  "discipline",
  "location",
  "tier",
  "role",
  "missing",
  "resource",
  "provider",
];

interface Tab {
  name: string;
  title: string;
  searchParams: URLSearchParams;
}

interface Tabs {
  [key: string]: Tab;
}

export const loader: LoaderFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 0);
  const search = url.searchParams.get("q") || "";
  const status = url.searchParams.getAll("status");
  const skill = url.searchParams.getAll("skill");
  const resource = url.searchParams.getAll("resource");
  const provider = url.searchParams.getAll("provider");
  const label = url.searchParams.getAll("label");
  const discipline = url.searchParams.getAll("discipline");
  const location = url.searchParams.getAll("location");
  const tier = url.searchParams.getAll("tier");
  const role = url.searchParams.getAll("role");
  const missing = url.searchParams.getAll("missing");
  const field = url.searchParams.get("field") || "";
  const order = url.searchParams.get("order") || "";
  const statuses = await getProjectStatuses();

  const ongoingStatuses = statuses.filter(
    (status) => status.stage === ongoingStage
  );
  const ideaStatuses = statuses.filter((status) => status.stage === ideaStage);

  const projectMembership = await getProjectMembership(profile.id);

  const data = await searchProjects({
    search,
    status,
    skill,
    label,
    discipline,
    location,
    tier,
    role,
    missing,
    resource,
    provider,
    profileId: profile.id,
    orderBy: { field, order },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });

  return new Response(
    JSON.stringify(
      { data, ongoingStatuses, ideaStatuses, projectMembership },
      (key, value) => (typeof value === "bigint" ? value.toString() : value) // return everything else unchanged
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
};

export default function Projects() {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: {
      projects,
      statusFacets,
      skillFacets,
      disciplineFacets,
      labelFacets,
      tierFacets,
      locationsFacets,
      roleFacets,
      missingFacets,
      count,
      resourceFacets,
      providerFacets,
    },
    projectMembership,
    ongoingStatuses,
    ideaStatuses,
  } = useLoaderData() as LoaderData;
  const myPropQuery = "myProposals";
  const activeProjectsSearchParams = new URLSearchParams();
  const ideasSearchParams = new URLSearchParams();
  let membershipCookie;

  function getCookie(name: string) {
    const value = `; ${document.cookie}`;
    const parts = value.split(`; ${name}=`);
    if (parts.length === 2) return parts?.pop()?.split(";").shift();
  }

  ongoingStatuses.forEach((status) => {
    activeProjectsSearchParams.append("status", status.name);
  });
  ideaStatuses.forEach((status) => {
    ideasSearchParams.append("status", status.name);
  });

  const activeProjectsTab: Tab = {
    name: "activeProjects",
    title: "Active Projects",
    searchParams: activeProjectsSearchParams,
  };
  const myProposalsTab: Tab = {
    name: "myProposals",
    title: "My Proposals",
    searchParams: new URLSearchParams({ q: myPropQuery }),
  };
  const ideasTab: Tab = {
    name: "ideas",
    title: "Ideas",
    searchParams: ideasSearchParams,
  };
  const tabs: Tabs = {
    myProposals: myProposalsTab,
    activeProjects: activeProjectsTab,
    ideas: ideasTab,
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    searchParams.set("page", String(value - 1));
    setSearchParams(searchParams);
  };

  const setSortQuery = ({ field, order }: { field: string; order: string }) => {
    searchParams.set("field", field);
    searchParams.set("order", order);
    setSearchParams(searchParams);
  };

  const initials = (preferredName: string, lastName: string) => {
    return preferredName.substring(0, 1) + lastName.substring(0, 1);
  };

  const deleteFilterUrl = (filter: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    let newFilter = newParams.getAll(filter).filter((item) => item != value);
    newParams.delete(filter);
    newFilter.forEach((item) => newParams.append(filter, item));
    if (filter === "resource") {
      let newProviderFilter = newParams
        .getAll("provider")
        .filter((item) => !item.startsWith(value + " | "));
      newParams.delete("provider");
      newProviderFilter.forEach((item) => newParams.append("provider", item));
    }
    return `?${newParams.toString()}`;
  };

  const replaceFilterUrl = (filter: string, value: string) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set(filter, value);
    return `?${newParams.toString()}`;
  };

  //Tabs selection logic
  const isMyProposalTab = () => {
    return searchParams.get("q") === myProposalsTab.searchParams.get("q");
  };

  const isIdeasTab = () => {
    return searchParams
      .getAll("status")
      .includes(ideasTab.searchParams.getAll("status")[0]);
  };

  const isInProgressTab = () => {
    return searchParams
      .getAll("status")
      .includes(activeProjectsTab.searchParams.getAll("status")[0]);
  };

  const getTitle = () => {
    if (isMyProposalTab()) {
      return myProposalsTab.title;
    } else if (isIdeasTab()) {
      return ideasTab.title;
    } else if (isInProgressTab()) {
      return activeProjectsTab.title;
    }
    return "All Projects";
  };

  const isTabActive = (tab: string) => {
    return (
      (tab == myProposalsTab.name && isMyProposalTab()) ||
      (tab == ideasTab.name && isIdeasTab()) ||
      (tab == activeProjectsTab.name && isInProgressTab())
    );
  };

  const handleTabChange = (selectedTab: string) => {
    const params = tabs[selectedTab]?.searchParams;
    if (params) {
      setSearchParams(params);
    }
  };

  //Mobile Filters logic
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const handleMobileFilters = () => {
    setOpenMobileFilters(!openMobileFilters);
  };

  const theme = useTheme();
  const lessThanMd = useMediaQuery(theme.breakpoints.down("md"));

  const StyledBox = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down("sm")]: {
      padding: "0 16px",
    },
  }));

  const StyledAppBar = styled(AppBar)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.mode === "dark" ? "#AF2E33" : "#701D21",
    background:
      theme.palette.mode === "dark" ? "#121212" : theme.palette.common.white,
  }));

  const StyledToolbar = styled(Toolbar)(({ theme }) => ({
    padding: "0 !important",
    minHeight: "30.75px !important",
  }));

  const StyledTabButton = styled(Button)(({ theme }) => ({
    fontWeight: "bold",
    color: theme.palette.mode === "dark" ? "#AF2E33" : "#701D21",
    background:
      theme.palette.mode === "dark" ? "#121212" : theme.palette.common.white,
    "&:hover": {
      background: theme.palette.mode === "dark" ? "#202020" : "#F5F5F5",
    },
  }));

  const viewOption = searchParams.get("view") || "card";

  if (typeof window !== "undefined") {
    membershipCookie = getCookie("checkMembership");
  }

  return (
    <>
      <Header title="Projects" />
      {/*
        Disable Gutters based on:
        https://stackoverflow.com/questions/70038913/materialui-show-and-hide-the-containers-gutters-based-on-breakpoints
      */}
      <StyledBox
        sx={{
          maxWidth: "1200px",
          height: "62.75px",
          margin: "0 auto",
          mb: 2,
          px: 3,
        }}
      >
        <StyledAppBar
          position="static"
          sx={{
            p: 2,
            display: "block",
            borderRadius: "4px",
            boxShadow: "none",
          }}
        >
          <StyledToolbar
            sx={{ position: "static", pl: 0, height: "30.75px!important" }}
          >
            {Object.values(tabs).map((tab) => (
              <StyledTabButton
                size="small"
                disableElevation
                variant={isTabActive(tab.name) ? "contained" : "text"}
                onClick={() => handleTabChange(tab.name)}
                key={tab.name}
                sx={{
                  color: isTabActive(tab.name)
                    ? prefersDarkMode
                      ? "#fff"
                      : "#000000"
                    : null,
                }}
              >
                {tab.title}
              </StyledTabButton>
            ))}
          </StyledToolbar>
        </StyledAppBar>
      </StyledBox>
      <Container>
        <Grid container spacing={2} alignItems="flex-start">
          <Grid
            item
            xs={8}
            md={3}
            sx={{
              position: { xs: "absolute", md: "inherit" },
              left: { xs: 0, md: undefined },
              zIndex: { xs: 2, md: undefined },
              display: {
                xs: openMobileFilters ? undefined : "none",
                md: "inherit",
              },
            }}
          >
            <Paper elevation={lessThanMd ? 5 : 0}>
              <Box sx={{ paddingTop: 1, paddingLeft: 2, paddingRight: 2 }}>
                <h3>
                  Selected Filters{" "}
                  <IconButton
                    aria-label="close"
                    onClick={handleMobileFilters}
                    sx={{ display: { md: "none" } }}
                  >
                    <CloseIcon />
                  </IconButton>
                </h3>
                {FACETS.filter((facet) =>
                  searchParams.get(facet) ? true : null
                )
                  .flatMap((facet) => {
                    return searchParams.getAll(facet).map((item) => {
                      return { filter: facet, value: item };
                    });
                  })
                  .map((chip) => (
                    <Chip
                      key={`${chip.filter}-${chip.value}`}
                      label={chip.value}
                      clickable={true}
                      size="small"
                      variant="outlined"
                      icon={<HighlightOffIcon />}
                      component={Link}
                      to={deleteFilterUrl(chip.filter, chip.value)}
                    />
                  ))}
              </Box>
              <hr />
              <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
                <h3>Filters</h3>
              </Box>
              {statusFacets.length > 0 && (
                <Accordion defaultExpanded={true} disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel1a-controls"
                    id="panel1a-header"
                  >
                    <strong>Status</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {statusFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&status=${
                              item.name
                            }`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}
              {tierFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel3a-controls"
                    id="panel3a-header"
                  >
                    <strong>Innovation tiers</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {tierFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&tier=${item.name}`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}
              {labelFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel3a-controls"
                    id="panel3a-header"
                  >
                    <strong>Labels</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {labelFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&label=${
                              item.name
                            }`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}
              {disciplineFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2a-controls"
                    id="panel2a-header"
                  >
                    <strong>Looking for</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {disciplineFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&discipline=${
                              item.name
                            }`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}
              {roleFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2a-controls"
                    id="panel2a-header"
                  >
                    <strong>Has Roles</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {roleFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&role=${item.name}`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}
              {missingFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2a-controls"
                    id="panel2a-header"
                  >
                    <strong>Does not have Roles</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {missingFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&missing=${
                              item.name
                            }`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}
              {skillFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2a-controls"
                    id="panel2a-header"
                  >
                    <strong>Skills</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {skillFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&skill=${
                              item.name
                            }`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}

              {resourceFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2a-controls"
                    id="panel2a-header"
                  >
                    <strong>Resources</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {resourceFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&resource=${
                              item.name
                            }`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}
              {providerFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel2a-controls"
                    id="panel2a-header"
                  >
                    <strong>Provider</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {providerFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&provider=${
                              item.name
                            }`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}

              {locationsFacets.length > 0 && (
                <Accordion disableGutters>
                  <AccordionSummary
                    expandIcon={<ExpandMore />}
                    aria-controls="panel3a-controls"
                    id="panel3a-header"
                  >
                    <strong>Locations</strong>
                  </AccordionSummary>
                  <AccordionDetails>
                    <ul>
                      {locationsFacets.map((item) => (
                        <li key={item.name}>
                          <Link
                            id={item.name}
                            color="#AF2E33"
                            to={`?${searchParams.toString()}&location=${
                              item.name
                            }`}
                          >
                            {item.name} ({item.count})
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </AccordionDetails>
                </Accordion>
              )}
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{ padding: 2 }}>
              <h2 style={{ marginTop: 0 }}>
                {getTitle() + ` (${count || 0})`}
              </h2>
              <div>
                <SortInput
                  setSortQuery={setSortQuery}
                  sortBy={searchParams.get("field") || ""}
                />
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
                &nbsp;
                <Button
                  variant="contained"
                  onClick={handleMobileFilters}
                  endIcon={<FilterAltIcon />}
                  sx={{ display: { md: "none" } }}
                >
                  Filters
                </Button>
              </div>
              {viewOption === "card" ? (
                <Grid
                  container
                  spacing={2}
                  sx={{ paddingTop: 2, paddingBottom: 2 }}
                >
                  {projects.map((item, i) => {
                    return (
                      <Grid item xs={12} sm={6} lg={4} key={i}>
                        <ProposalCard
                          id={item.id}
                          title={item.name}
                          picture={item.avatarUrl}
                          initials={initials(item.preferredName, item.lastName)}
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
                            .map((skill) => ({ name: skill }))}
                          tierName={item.tierName}
                          projectMembers={Number(item.projectMembers)}
                        />
                      </Grid>
                    );
                  })}
                </Grid>
              ) : (
                <Table size="small">
                  <TableHead>
                    <TableRow>
                      <TableCell>Name</TableCell>
                      <TableCell>
                        <a
                          href="https://wizeline.atlassian.net/wiki/spaces/wiki/pages/3075342381/Innovation+Tiers"
                          target="_blank"
                          rel="noreferrer"
                          style={{ color: "inherit" }}
                        >
                          Tier
                        </a>
                      </TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Contributors</TableCell>
                      <TableCell>Likes</TableCell>
                      <TableCell>Skills</TableCell>
                      <TableCell>Resources</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {projects.map((item, i) => (
                      <TableRow key={i}>
                        <TableCell>
                          <a
                            href={`/projects/${item.id}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {item.name}
                          </a>
                        </TableCell>
                        <TableCell>
                          <Chip
                            component="a"
                            href={`/projects?tier=${item.tierName}`}
                            clickable
                            rel="noreferrer"
                            label={item.tierName}
                          />
                        </TableCell>
                        <TableCell>
                          <a
                            href={`/projects/${item.id}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {item.status}
                          </a>
                        </TableCell>
                        <TableCell>{item.projectMembers}</TableCell>
                        <TableCell>{item.votesCount}</TableCell>
                        <TableCell>
                          <a
                            href={`/projects/${item.id}`}
                            style={{ color: "inherit", textDecoration: "none" }}
                          >
                            {item.searchSkills}
                          </a>
                        </TableCell>
                        <TableCell>{item.resourcesCount}</TableCell>
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
        </Grid>
      </Container>
      <MembershipModal
        open={projectMembership.length > 0 && membershipCookie == null}
        handleCloseModal={() => {}}
        projects={projectMembership}
      />
    </>
  );
}
