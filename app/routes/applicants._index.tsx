import MaterialTable, { Column } from "@material-table/core";
import { ExportCsv } from "@material-table/exporters";
import { Container, Paper } from "@mui/material";
import { MetaFunction } from "@remix-run/node";
import Header from "app/core/layouts/Header";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import Link from "~/core/components/Link";
import NavAppBar from "~/core/components/NavAppBar";
import WhatsAppLink from "~/core/components/WhatsAppLink";
import { searchApplicants } from "~/models/applicant.server";

export const meta: MetaFunction = () => {
  return [{ title: "Applicants" }];
};

export const loader = async () => {
  const data = await searchApplicants();
  return typedjson(
    data.map((a) => ({
      id: a.id,
      fullName: a.fullName,
      email: a.personalEmail,
      universityEmail: a.universityEmail,
      phone: a.phone,
      startDate: a.startDate,
      endDate: a.endDate,
      dayOfBirth: a.dayOfBirth,
      graduationDate: a.graduationDate,
      hoursPerWeek: a.hoursPerWeek,
      university: a.university?.name,
      semester: a.semester,
      participatedAtWizeline: a.participatedAtWizeline,
      status: a.status,
      appliedProjects: a.appliedProjects,
    }))
  );
};

export default function Projects() {
  const applicants = useTypedLoaderData<typeof loader>();
  const columns: Column<typeof applicants[number]>[] = [
    {
      field: "fullName",
      title: "Name",
      render: (rowData) => (
        <Link to={`./${rowData.id}`}>{rowData.fullName}</Link>
      ),
    },
    { field: "email", title: "Email", hidden: true },
    {
      field: "universityEmail",
      title: "universityEmail",
      hidden: true,
    },
    {
      field: "phone",
      title: "Phone",
      hidden: true,
      render: (rowData) => WhatsAppLink({ phoneNumber: rowData.phone }),
    },
    {
      field: "startDate",
      title: "Start Date",
      type: "date",
      width: "10%",
      dateSetting: { locale: "en-US", format: "dd.MM.yyyy" },
    },
    {
      field: "endDate",
      title: "End Date",
      type: "date",
      width: "10%",
      dateSetting: { locale: "en-US", format: "dd.MM.yyyy" },
    },
    {
      field: "dayOfBirth",
      title: "Date of Birth",
      type: "date",
      dateSetting: { locale: "en-US", format: "dd.MM.yyyy" },
      width: "10%",
      hidden: true,
    },
    {
      field: "graduationDate",
      title: "Approx Graduation Date",
      type: "date",
      dateSetting: { locale: "en-US", format: "dd.MM.yyyy" },
      width: "10%",
      hidden: true,
    },
    {
      field: "hoursPerWeek",
      title: "Hr/w",
      width: "5%",
      tooltip: "Hours per week",
    },
    { field: "university", title: "University" },
    { field: "semester", title: "Semester", hidden: true },
    {
      field: "participatedAtWizeline",
      title: "Knows Wizeline",
      type: "boolean",
      width: "5%",
      hidden: true,
    },
    {
      field: "status",
      title: "Status",
      width: "10%",
      hidden: false,
      lookup: {
        DRAFT: "DRAFT",
        HOLD: "HOLD",
        ACCEPTED: "ACCEPTED",
        REJECTED: "REJECTED",
      },
    },
    {
      field: "appliedProjects",
      title: "Applied Projects",
      hidden: true,
    },
  ];

  return (
    <>
      <Header title="Applicants" />
      <NavAppBar title="Internship Applicants" />
      <Container>
        <Paper sx={{ p: 2 }}>
          {/* <h1 style={{ marginTop: 0 }}>Applicants</h1> */}
          <MaterialTable
            sx={{ fontSize: "0.8rem" }}
            title="Applicants"
            data={applicants}
            columns={columns}
            options={{
              showTitle: true,
              emptyRowsWhenPaging: false,
              padding: "dense",
              pageSize: 50,
              pageSizeOptions: [20, 50, 100],
              filtering: true,
              columnsButton: true,
              exportAllData: true,
              exportMenu: [
                {
                  label: "Export CSV",
                  exportFunc: (cols, datas) =>
                    ExportCsv(cols, datas, "applicants"),
                },
              ],
              rowStyle: (rowData) => ({
                backgroundColor:
                  rowData.status !== "DRAFT"
                    ? "rgb(12, 54, 73, 0.3)"
                    : "inherit",
              }),
            }}
          />
        </Paper>
      </Container>
    </>
  );
}
