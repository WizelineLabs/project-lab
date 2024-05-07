import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ViewListIcon from "@mui/icons-material/ViewList";
import ViewModuleIcon from "@mui/icons-material/ViewModule";
import {
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  Paper,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import type { LoaderFunction } from "@remix-run/node";
import { useLoaderData, useSearchParams } from "@remix-run/react";
import { SortInput } from "app/core/components/SortInput";
import Header from "app/core/layouts/Header";
import "instantsearch.css/themes/satellite.css";
import { useState } from "react";
import { InstantSearch, SearchBox, Pagination } from "react-instantsearch-dom";
import TypesenseInstantsearchAdapter from "typesense-instantsearch-adapter";
import { ongoingStage, ideaStage } from "~/constants";
import FilterAccordion from "~/core/components/FilterAccordion";
import CustomHitsInstantSearch from "~/core/components/HitsInstantSearch/ProjectHits";
import TableHits from "~/core/components/HitsInstantSearch/TableHits";
import Link from "~/core/components/Link";
import MembershipModal from "~/core/components/MembershipModal/index";
import NavAppBar from "~/core/components/NavAppBar";
import { getProjectMembership, searchProjects } from "~/models/project.server";
import type { ProjectStatus } from "~/models/status.server";
import { getProjectStatuses } from "~/models/status.server";
import { requireProfile } from "~/session.server";

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

interface LoaderData {
  data: Awaited<ReturnType<typeof searchProjects>>;
  ongoingStatuses: ProjectStatus[];
  ideaStatuses: ProjectStatus[];
  projectMembership: projectMembership[];
  message: string;
}

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

interface QuickFilter {
  name: string;
  title: string;
  searchParams: URLSearchParams;
}

type QuickFilters = Record<string, QuickFilter>;

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

export default function Projects() {
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    data: {
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

  const activeProjectsFilter: QuickFilter = {
    name: "activeProjects",
    title: "Active Projects",
    searchParams: activeProjectsSearchParams,
  };
  const myProposalsFilter: QuickFilter = {
    name: "myProposals",
    title: "My Proposals",
    searchParams: new URLSearchParams({ q: myPropQuery }),
  };
  const ideasFilter: QuickFilter = {
    name: "ideas",
    title: "Ideas",
    searchParams: ideasSearchParams,
  };
  const quickFilters: QuickFilters = {
    myProposals: myProposalsFilter,
    activeProjects: activeProjectsFilter,
    ideas: ideasFilter,
  };

  const setSortQuery = ({ field, order }: { field: string; order: string }) => {
    searchParams.set("field", field);
    searchParams.set("order", order);
    setSearchParams(searchParams);
  };

  const deleteFilterUrl = (filter: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const newFilter = newParams.getAll(filter).filter((item) => item != value);
    newParams.delete(filter);
    newFilter.forEach((item) => newParams.append(filter, item));
    if (filter === "resource") {
      const newProviderFilter = newParams
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

  //Mobile Filters logic
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const handleMobileFilters = () => {
    setOpenMobileFilters(!openMobileFilters);
  };

  const theme = useTheme();
  const lessThanMd = useMediaQuery(theme.breakpoints.down("md"));

  const viewOption = searchParams.get("view") || "card";

  if (typeof window !== "undefined") {
    membershipCookie = getCookie("checkMembership");
  }

  const [searchValue, setSearchValue] = useState("");

  return (
    <>
      <Header title="projects" onSearch={setSearchValue} />
      {/*
        Disable Gutters based on:
        https://stackoverflow.com/questions/70038913/materialui-show-and-hide-the-containers-gutters-based-on-breakpoints
      */}

      <link
        rel="stylesheet"
        href="https://cdn.jsdelivr.net/npm/instantsearch.css@8.1.0/themes/reset.css"
      />
      <NavAppBar title="Projects" />
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
                <h3>Quick Filters</h3>
              </Box>
              <hr />
              <Box>
                <ul>
                  <li>
                    <Link
                      color="#AF2E33"
                      to={`?${quickFilters.myProposals.searchParams.toString()}`}
                    >
                      My Proposals
                    </Link>
                  </li>
                  <li>
                    <Link
                      color="#AF2E33"
                      to={`?${quickFilters.activeProjects.searchParams.toString()}`}
                    >
                      Active Projects
                    </Link>
                  </li>
                  <li>
                    <Link
                      color="#AF2E33"
                      to={`?${quickFilters.ideas.searchParams.toString()}`}
                    >
                      Ideas
                    </Link>
                  </li>
                </ul>
              </Box>
              <hr />
              <Box sx={{ paddingLeft: 2, paddingRight: 2 }}>
                <h3>Filters</h3>
              </Box>
              {statusFacets.length > 0 ? (
                <FilterAccordion
                  title="Status"
                  filter="status"
                  items={statusFacets}
                />
              ) : null}
              {tierFacets.length > 0 ? (
                <FilterAccordion
                  title="Innovation tiers"
                  filter="tier"
                  items={tierFacets}
                />
              ) : null}
              {labelFacets.length > 0 ? (
                <FilterAccordion
                  title="Labels"
                  filter="label"
                  items={labelFacets}
                />
              ) : null}
              {disciplineFacets.length > 0 ? (
                <FilterAccordion
                  title="Looking for"
                  filter="discipline"
                  items={disciplineFacets}
                />
              ) : null}
              {roleFacets.length > 0 ? (
                <FilterAccordion
                  title="Has Roles"
                  filter="role"
                  items={roleFacets}
                />
              ) : null}
              {missingFacets.length > 0 ? (
                <FilterAccordion
                  title="Does not have Roles"
                  filter="missing"
                  items={missingFacets}
                />
              ) : null}
              {skillFacets.length > 0 ? (
                <FilterAccordion
                  title="Skills"
                  filter="skill"
                  items={skillFacets}
                />
              ) : null}

              {resourceFacets.length > 0 ? (
                <FilterAccordion
                  title="Resources"
                  filter="resource"
                  items={resourceFacets}
                />
              ) : null}
              {providerFacets.length > 0 ? (
                <FilterAccordion
                  title="Provider"
                  filter="provider"
                  items={providerFacets}
                />
              ) : null}
              {locationsFacets.length > 0 ? (
                <FilterAccordion
                  title="Locations"
                  filter="location"
                  items={locationsFacets}
                />
              ) : null}
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{ padding: 2 }}>
              <h2 style={{ marginTop: 0 }}>{`Projects (${count || 0})`}</h2>
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
                <InstantSearch indexName="projects" searchClient={searchClient}>
                  <div hidden style={{ listStyle: "none" }}>
                    <SearchBox defaultRefinement={searchValue} />
                  </div>
                  <Grid container spacing={2}>
                    <CustomHitsInstantSearch />
                  </Grid>
                  <Pagination />
                </InstantSearch>
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
                    <InstantSearch
                      indexName="projects"
                      searchClient={searchClient}
                    >
                      <div hidden style={{ listStyle: "none" }}>
                        <SearchBox defaultRefinement={searchValue} />
                      </div>
                      <TableHits />
                      <Pagination />
                    </InstantSearch>
                  </TableBody>
                </Table>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <MembershipModal
        open={projectMembership.length > 0 ? membershipCookie == null : false}
        projects={projectMembership}
      />
    </>
  );
}
