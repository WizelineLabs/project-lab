import { Container, Paper } from "@mui/material";
import { useLoaderData } from "@remix-run/react";
import type { LoaderFunction } from "@remix-run/server-runtime";
import Header from "app/core/layouts/Header";
import type { GridColDef, GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid } from "@mui/x-data-grid";
import { searchApplicants } from "~/models/applicant.server";

export const loader: LoaderFunction = async ({ request }) => {
  const data = await searchApplicants();
  return data;
};

export default function Projects() {
  const applicants = useLoaderData();
  const columns: GridColDef[] = [
    {
      field: "fullName",
      headerName: "Name",
      flex: 1,
      renderCell: (params: GridRenderCellParams<string>) => {
        return <a href={`mailto:${params.value}`}>{params.row.fullName}</a>;
      },
    },
    {
      field: "startDate",
      headerName: "Start Date",
      flex: 0.5,
      valueFormatter(params) {
        return new Date(params.value).toLocaleDateString();
      },
    },
    {
      field: "endDate",
      headerName: "End Date",
      flex: 0.5,
      valueFormatter(params) {
        return new Date(params.value).toLocaleDateString();
      },
    },
    { field: "hoursPerWeek", headerName: "Hours Per Week", flex: 0.5 },
  ];
  return (
    <>
      <Header title="Applicants" />
      <Container>
        <Paper sx={{ p: 2 }}>
          <h1 style={{ marginTop: 0 }}>Applicants</h1>
          <DataGrid rows={applicants} columns={columns} autoHeight={true} />
        </Paper>
      </Container>
    </>
  );
}
