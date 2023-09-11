import {
  Avatar,
  Box,
  Button,
  Chip,
  Container,
  Grid,
  IconButton,
  InputAdornment,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { useState } from "react";
import type { LoaderFunction } from "@remix-run/node";
import CloseIcon from "@mui/icons-material/Close";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SearchIcon from "@mui/icons-material/Search";
import Link from "~/core/components/Link";
import Header from "~/core/layouts/Header";
import { searchProfilesFull } from "~/models/profile.server";
import { useLoaderData, useNavigate, useSearchParams } from "@remix-run/react";
import FilterAccordion from "~/core/components/FilterAccordion";

const stringToColor = (string: string) => {
  let hash = 0;
  let i;

  /* eslint-disable no-bitwise */
  for (i = 0; i < string.length; i += 1) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }

  let color = "#";

  for (i = 0; i < 3; i += 1) {
    const value = (hash >> (i * 8)) & 0xff;
    color += `00${value.toString(16)}`.slice(-2);
  }
  /* eslint-enable no-bitwise */

  return color;
};

interface ProjectAssigmentProps {
  projectMember: {
    project: {
      id: string;
      name: string;
    };
    role: {
      name: string;
    }[];
  };
}
const ProjectAssignment = ({ projectMember }: ProjectAssigmentProps) => {
  return (
    <Box
      sx={{
        border: "1px solid white",
        borderRadius: "5px",
        padding: "4px",
        backgroundColor: stringToColor(projectMember.project.name),
        margin: "4px 0px",
      }}
    >
      <div style={{ fontWeight: "bold" }}>{projectMember.project.name}</div>
      {projectMember.role.length > 0 && (
        <div>
          {projectMember.role
            .map((role: { name: string }) => role.name)
            .join("/")}
        </div>
      )}
    </Box>
  );
};

const ITEMS_PER_PAGE = 50;
const FILTERS = [
  "employeeStatus",
  "department",
  "businessUnit",
  "benchStatus",
  "skill",
];

type LoaderData = {
  data: Awaited<ReturnType<typeof searchProfilesFull>>;
  message: string;
};

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const searchTerm = url.searchParams.get("psearch") || "";
  const page = Number(url.searchParams.get("page") || 1);
  const department = url.searchParams.getAll("department");
  const businessUnit = url.searchParams.getAll("businessUnit");
  const benchStatus = url.searchParams.getAll("benchStatus");
  const employeeStatus = url.searchParams.getAll("employeeStatus");
  const skill = url.searchParams.getAll("skill");

  const data = await searchProfilesFull({
    searchTerm,
    page,
    department,
    businessUnit,
    benchStatus,
    employeeStatus,
    skill,
    itemsPerPage: ITEMS_PER_PAGE,
  });

  return new Response(
    JSON.stringify({ data }, (key, value) =>
      typeof value === "bigint" ? value.toString() : value
    ),
    {
      headers: {
        "Content-Type": "application/json; charset=utf-8",
      },
    }
  );
};

const Profiles = () => {
  const [openMobileFilters, setOpenMobileFilters] = useState(false);
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [searchValue, setSearchValue] = useState("");
  const {
    data: {
      profiles,
      count,
      departments,
      businessUnits,
      benchStatuses,
      employeeStatuses,
      skills,
    },
  } = useLoaderData() as unknown as LoaderData;
  const theme = useTheme();
  const lessThanMd = useMediaQuery(theme.breakpoints.down("md"));

  const handleMobileFilters = () => {
    setOpenMobileFilters(!openMobileFilters);
  };

  const deleteFilterUrl = (filter: string, value: string | null) => {
    const newParams = new URLSearchParams(searchParams.toString());
    let newFilter = newParams.getAll(filter).filter((item) => item != value);
    newParams.delete(filter);
    newFilter.forEach((item) => newParams.append(filter, item));
    return `?${newParams.toString()}`;
  };

  const getNameInitials = (name: string, lastName: string): string => {
    return name.substring(0, 1) + lastName.substring(0, 1);
  };

  const handlePaginationChange = (
    event: React.ChangeEvent<unknown>,
    value: number
  ) => {
    searchParams.set("page", String(value));
    setSearchParams(searchParams);
  };

  const handleEnterKeyPress = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "Enter") {
      navigate(`/profiles?psearch=${searchValue}`);
    }
  };

  return (
    <>
      <Header title="Profiles" />
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
            <Paper elevation={lessThanMd ? 5 : 0} sx={{ width: "100%" }}>
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
                {FILTERS.filter((filter) =>
                  searchParams.get(filter) ? true : null
                )
                  .flatMap((filter) => {
                    return searchParams.getAll(filter).map((item) => {
                      return { filter: filter, value: item };
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
              <FilterAccordion
                title="Department"
                filter="department"
                items={departments}
              />
              <FilterAccordion
                title="Business Unit"
                filter="businessUnit"
                items={businessUnits}
              />
              <FilterAccordion
                title="Employee Status"
                filter="employeeStatus"
                items={employeeStatuses}
              />
              <FilterAccordion
                title="Bench Status"
                filter="benchStatus"
                items={benchStatuses}
              />
              <FilterAccordion title="Skill" filter="skill" items={skills} />
            </Paper>
          </Grid>
          <Grid item xs={12} md={9}>
            <Paper elevation={0} sx={{ padding: 2 }}>
              <Box sx={{ display: "grid", gridTemplateColumns: "1fr auto" }}>
                <Typography variant="h5" fontWeight="bold">
                  Profiles
                </Typography>
                <TextField
                  name="psearch"
                  label="Search Profile"
                  variant="outlined"
                  size="small"
                  onChange={(e) => setSearchValue(e.target.value)}
                  onKeyPress={(e) => {
                    handleEnterKeyPress(e);
                  }}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon />
                      </InputAdornment>
                    ),
                  }}
                />
              </Box>
              <div>
                <Button
                  variant="contained"
                  onClick={handleMobileFilters}
                  endIcon={<FilterAltIcon />}
                  sx={{ display: { md: "none" } }}
                >
                  Filters
                </Button>
              </div>
              <Table size="small">
                <TableHead>
                  <TableRow>
                    <TableCell sx={{ width: "40%" }}>Name</TableCell>
                    <TableCell sx={{ width: "30%" }}>
                      Tech Program/Business Unit
                    </TableCell>
                    <TableCell sx={{ width: "30%" }}>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {profiles.map((item, i) => (
                    <TableRow key={i}>
                      <TableCell>
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "40px 1fr",
                            gap: "1rem",
                          }}
                        >
                          <Avatar
                            sx={{
                              backgroundColor: stringToColor(
                                `${item.preferredName} ${item.lastName}`
                              ),
                            }}
                            alt={`${item.preferredName} ${item.lastName}`}
                            src={item.avatarUrl ?? ""}
                          >
                            {getNameInitials(item.preferredName, item.lastName)}
                          </Avatar>
                          <Box
                            sx={{ display: "flex", flexDirection: "column" }}
                          >
                            <Typography
                              sx={{ fontWeight: "bold" }}
                            >{`${item.preferredName} ${item.lastName}`}</Typography>
                            <Typography variant="caption">
                              {item.jobLevelTitle}
                            </Typography>
                            <Typography variant="caption">
                              {item.location}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {item.department}
                        </Typography>
                        {item.businessUnit}
                      </TableCell>
                      <TableCell>
                        <Typography sx={{ fontWeight: "bold" }}>
                          {item.employeeStatus}
                        </Typography>
                        {item.projectMembers.length > 0 && (
                          <>
                            {item.projectMembers.map((projectMember, index) => (
                              <ProjectAssignment
                                key={index}
                                projectMember={projectMember}
                              />
                            ))}
                          </>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
    </>
  );
};

export default Profiles;
