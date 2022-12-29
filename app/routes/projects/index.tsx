import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import {
  Link,
  useLoaderData,
  useSearchParams,
} from "@remix-run/react";
import CardBox from "app/core/components/CardBox";
import ProposalCard from "app/core/components/ProposalCard";
import Header from "app/core/layouts/Header";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Chip,
} from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import ExpandMore from "@mui/icons-material/ExpandMore";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import CloseIcon from "@mui/icons-material/Close";
import { SortInput } from "app/core/components/SortInput";
import Wrapper from "../../styles/projects.styles";
import { searchProjects } from "~/models/project.server";
import { requireProfile } from "~/session.server";
import type { ProjectStatus } from "~/models/status.server";
import { getProjectStatuses } from "~/models/status.server";
import { ongoingStage, ideaStage } from "~/constants";

type LoaderData = {
  data: Awaited<ReturnType<typeof searchProjects>>;
  ongoingStatuses: ProjectStatus[];
  ideaStatuses: ProjectStatus[];
};

const ITEMS_PER_PAGE = 50;
const FACETS = [
  "status",
  "skill",
  "label",
  "disciplines",
  "location",
  "tier",
  "role",
  "missing",
];

interface Tab {
  name: string;
  title: string;
  searchParams: URLSearchParams;
}

export const loader: LoaderFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  const url = new URL(request.url);
  const page = Number(url.searchParams.get("page") || 0);
  const search = url.searchParams.get("q") || "";
  const status = url.searchParams.getAll("status");
  const skill = url.searchParams.getAll("skill");
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
    profileId: profile.id,
    orderBy: { field, order },
    skip: ITEMS_PER_PAGE * page,
    take: ITEMS_PER_PAGE,
  });
  // return json<LoaderData>({ data, ongoingStatuses, ideaStatuses });
  return new Response(
    JSON.stringify(
      { data, ongoingStatuses, ideaStatuses },
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
  //functions to load and paginate projects in `Popular` CardBox
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Number(searchParams.get("page") || 0);

  //sorting variables
  const [, setSortQuery] = useState({ field: "name", order: "desc" });

  let {
    data: {
      projects,
      hasMore,
      statusFacets,
      skillFacets,
      disciplineFacets,
      labelFacets,
      tierFacets,
      locationsFacets,
      roleFacets,
      missingFacets,
      count,
    },
    ongoingStatuses,
    ideaStatuses,
  } = useLoaderData() as LoaderData;
  const myPropQuery = "myProposals";
  const activeProjectsSearchParams = new URLSearchParams();
  const ideasSearchParams = new URLSearchParams();
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
  const myProposalsTab = {
    name: "myProposals",
    title: "My Proposals",
    searchParams: new URLSearchParams({ q: myPropQuery }),
  };
  const ideasTab = {
    name: "ideas",
    title: "Ideas",
    searchParams: ideasSearchParams,
  };
  const tabs: Array<Tab> = [myProposalsTab, activeProjectsTab, ideasTab];

  const goToPreviousPage = () => {
    searchParams.set("page", String(page - 1));
    setSearchParams(searchParams);
  };

  const goToNextPage = () => {
    searchParams.set("page", String(page + 1));
    setSearchParams(searchParams);
  };

  const initials = (firstName: string, lastName: string) => {
    return firstName.substring(0, 1) + lastName.substring(0, 1);
  };

  const deleteFilterUrl = (filter: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    const newFilter = newParams.getAll(filter).filter((item) => item != value);
    newParams.delete(filter);
    newFilter.forEach((item) => newParams.append(filter, item));
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

  const getTabClass = (tab: string) => {
    if (
      (tab == myProposalsTab.name && isMyProposalTab()) ||
      (tab == ideasTab.name && isIdeasTab()) ||
      (tab == activeProjectsTab.name && isInProgressTab())
    ) {
      return "homeWrapper__navbar__tabs--title--selected";
    } else {
      return "";
    }
  };

  const handleTabChange = (selectedTab: string) => {
    let params = tabs.find((tab) => tab.name === selectedTab)?.searchParams;
    if (params) {
      setSearchParams(params);
    }
  };

  //Mobile Filters logic
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const handleMobileFilters = () => {
    setOpenMobileFilters(!openMobileFilters);
  };

  return (
    <>
      <Header title="Projects" />
      <Wrapper className="homeWrapper" filtersOpen={openMobileFilters}>
        <div className="homeWrapper__navbar">
          <div className="homeWrapper__navbar__tabs">
            {tabs.map((tab) => (
              <div
                className={`homeWrapper__navbar__tabs--title ${getTabClass(
                  tab.name
                )}`}
                onClick={() => handleTabChange(tab.name)}
                key={tab.name}
              >
                {tab.title}
              </div>
            ))}
          </div>
        </div>
        <div className="homeWrapper--content">
          <div className="homeWrapper__myProposals">
            <CardBox
              className="filter__box"
              bodyClassName="filter__content__card"
            >
              <div>
                <CloseIcon
                  fontSize="large"
                  className="filter__mobile-close-button"
                  onClick={handleMobileFilters}
                />
                <div>
                  <div className="filter__title">Selected Filters</div>
                  <div>
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
                          className="homeWrapper__myProposals--filters"
                          icon={<HighlightOffIcon />}
                          component={Link}
                          to={deleteFilterUrl(chip.filter, chip.value)}
                        />
                      ))}
                  </div>
                </div>
                <div className="filter__title">Filters</div>
                {statusFacets.length > 0 && (
                  <Accordion
                    expanded
                    disableGutters
                    className="homeWrapper__accordion"
                  >
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel1a-controls"
                      id="panel1a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Status</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
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
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel3a-controls"
                      id="panel3a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Innovation tiers</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
                        {tierFacets.map((item) => (
                          <li key={item.name}>
                            <Link
                              id={item.name}
                              color="#AF2E33"
                              to={`?${searchParams.toString()}&tier=${
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
                {labelFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel3a-controls"
                      id="panel3a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Labels</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
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
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel2a-controls"
                      id="panel2a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Looking for</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
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
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel2a-controls"
                      id="panel2a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Roles</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
                        {roleFacets.map((item) => (
                          <li key={item.name}>
                            <Link
                              id={item.name}
                              color="#AF2E33"
                              to={`?${searchParams.toString()}&role=${
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
                {missingFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel2a-controls"
                      id="panel2a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Missing Roles</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
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
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel2a-controls"
                      id="panel2a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Skills</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
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
                {locationsFacets.length > 0 && (
                  <Accordion disableGutters className="homeWrapper__accordion">
                    <AccordionSummary
                      expandIcon={<ExpandMore />}
                      aria-controls="panel3a-controls"
                      id="panel3a-header"
                      className="accordion__filter__title"
                    >
                      <h4>Locations</h4>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ul className="homeWrapper__myProposals--list">
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
              </div>
            </CardBox>
          </div>
          <div className="homeWrapper__information">
            <div className="homeWrapper__information--row">
              <CardBox title={getTitle() + ` (${count || 0})`}>
                <div className="homeWrapper__navbar__sort">
                  <SortInput setSortQuery={setSortQuery} sortBy={""} />
                  <button
                    className="filter__mobile-button"
                    onClick={handleMobileFilters}
                  >
                    Filters
                    <FilterAltIcon
                      sx={{
                        fontSize: "17px",
                        position: "absolute",
                        top: "20%",
                      }}
                    />
                  </button>
                </div>
                <div className="homeWrapper__popular">
                  {projects.map((item, i) => {
                    return (
                      <ProposalCard
                        key={i}
                        id={item.id}
                        title={item.name}
                        picture={item.avatarUrl}
                        initials={initials(item.firstName, item.lastName)}
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
                          .split(",")
                          .map((skill) => ({ name: skill.trim() }))}
                        tierName={item.tierName}
                        projectMembers={Number(item.projectMembers)}
                      />
                    );
                  })}
                </div>
                <div className="homeWrapper__pagination-buttons">
                  <button
                    type="button"
                    disabled={page === 0}
                    className={
                      page == 0
                        ? "primary default pageButton"
                        : "primary pageButton"
                    }
                    onClick={goToPreviousPage}
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    disabled={!hasMore}
                    className={
                      !hasMore
                        ? "primary default pageButton"
                        : "primary pageButton"
                    }
                    onClick={goToNextPage}
                  >
                    Next
                  </button>
                </div>
              </CardBox>
            </div>
          </div>
        </div>
      </Wrapper>
    </>
  );
}
