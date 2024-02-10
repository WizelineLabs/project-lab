import { Container, Paper, darken, lighten } from "@mui/material";
import { styled } from "@mui/material/styles";
import type {
  GridColDef,
  GridFilterModel,
  GridRenderCellParams,
  GridSortModel,
  GridValueFormatterParams,
  GridValueGetterParams,
} from "@mui/x-data-grid";
import { DataGrid, GridToolbar } from "@mui/x-data-grid";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { type LoaderFunction } from "@remix-run/server-runtime";
import Header from "app/core/layouts/Header";
import Link from "~/core/components/Link";
import NavAppBar from "~/core/components/NavAppBar";
import { searchApplicants } from "~/models/applicant.server";

export const loader: LoaderFunction = async ({ request }) => {
  const data = await searchApplicants();
  return data.map((a) => ({
    id: a.id,
    fullName: a.fullName,
    email: a.personalEmail,
    phone: a.phone,
    startDate: a.startDate,
    endDate: a.endDate,
    graduationDate: a.graduationDate,
    hoursPerWeek: a.hoursPerWeek,
    university: a.university?.name,
    semester: a.semester,
    participatedAtWizeline: a.participatedAtWizeline,
    status: a.status,
    appliedProjects: a.appliedProjects,
  }));
};

const shortDateFormatter = (params: GridValueFormatterParams) => {
  const date = new Date(params.value);
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const getBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.7) : lighten(color, 0.7);

const getHoverBackgroundColor = (color: string, mode: string) =>
  mode === "dark" ? darken(color, 0.4) : lighten(color, 0.4);

const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
  "& .status-HOLD": {
    backgroundColor: getBackgroundColor(
      theme.palette.info.main,
      theme.palette.mode
    ),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.info.main,
        theme.palette.mode
      ),
    },
  },

  "& .status-ACCEPTED": {
    backgroundColor: getBackgroundColor(
      theme.palette.success.main,
      theme.palette.mode
    ),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.success.main,
        theme.palette.mode
      ),
    },
  },

  "& .status-REJECTED": {
    backgroundColor: getBackgroundColor(
      theme.palette.warning.main,
      theme.palette.mode
    ),
    "&:hover": {
      backgroundColor: getHoverBackgroundColor(
        theme.palette.warning.main,
        theme.palette.mode
      ),
    },
  },
}));

export default function Projects() {
  const applicants = useLoaderData<typeof loader>();
  const navigate = useNavigate();
  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {
        return <Link to={`./${params.row.id}`}>{params.row.fullName}</Link>;
      },
    },
    { field: "email", headerName: "Email", flex: 0.5, hide: true },
    { field: "phone", headerName: "Phone", flex: 0.5, hide: true },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 0.4,
      type: "date",
      valueGetter: (params: GridValueGetterParams) => {
        return new Date(params.value).toISOString();
      },
      valueFormatter: shortDateFormatter,
    },
    {
      field: "endDate",
      headerName: "End Date",
      type: "date",
      flex: 0.4,
      valueGetter(params) {
        return new Date(params.value).toISOString();
      },
      valueFormatter: shortDateFormatter,
    },
    {
      field: "graduationDate",
      headerName: "Approx Graduation Date",
      type: "date",
      flex: 0.5,
      valueGetter(params) {
        return new Date(params.value).toISOString();
      },
      valueFormatter: shortDateFormatter,
      hide: true,
    },
    { field: "hoursPerWeek", headerName: "Hour/w", flex: 0.2 },
    { field: "university", headerName: "University", flex: 1 },
    { field: "semester", headerName: "Semester", flex: 1, hide: true },
    {
      field: "participatedAtWizeline",
      headerName: "Knows Wizeline",
      type: "boolean",
      flex: 1,
      hide: true,
    },
    { field: "status", headerName: "Status", flex: 0.4, hide: false },
    {
      field: "appliedProjects",
      headerName: "Applied Projects",
      flex: 0.5,
      hide: true,
    },
  ];

  const filterModel: GridFilterModel = {
    items: [
      {
        id: 1,
        columnField: "status",
        operatorValue: "equals",
        value: "DRAFT",
      },
      //Just the pro version allows more than one filter
    ],
  };

  const selectRow = (id: string) => {
    navigate(`./${id}`);
  };

  const sortModel: GridSortModel = [{ field: "startDate", sort: "asc" }];

  return (
    <>
      <Header title="Applicants" />
      <NavAppBar title="Internship Applicants" />
      <Container>
        <Paper sx={{ p: 2 }}>
          <h1 style={{ marginTop: 0 }}>Applicants</h1>
          <StyledDataGrid
            rows={applicants}
            columns={columns}
            autoHeight={true}
            onRowClick={(e) => selectRow(e.id as string)}
            initialState={{
              filter: { filterModel },
              sorting: { sortModel },
            }}
            components={{
              Toolbar: GridToolbar,
            }}
            isRowSelectable={(e) => e.row.status !== "HOLD"}
            getRowClassName={(params) => `status-${params.row.status}`}
          />
        </Paper>
      </Container>
    </>
  );
}
