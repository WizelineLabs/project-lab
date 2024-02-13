import { Container, Paper } from "@mui/material";
import { MetaFunction } from "@remix-run/node";
import Header from "app/core/layouts/Header";
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from "material-react-table";
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
  const columns: MRT_ColumnDef<typeof applicants[number]>[] = [
    {
      accessorKey: "fullName",
      header: "Name",
      Cell: ({ row, renderedCellValue }) =>
        Link({
          to: `/applicants/${row.original.id}`,
          children: renderedCellValue,
        }),
    },
    { accessorKey: "email", header: "Email" },
    {
      accessorKey: "universityEmail",
      header: "universityEmail",
    },
    {
      accessorKey: "phone",
      header: "Phone",
      Cell: ({ row }) => WhatsAppLink({ phoneNumber: row.original.phone }),
    },
    {
      accessorKey: "startDate",
      header: "Start Date",
      enableColumnFilter: false,
      sortingFn: "datetime",
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
      size: 100,
    },
    {
      accessorKey: "endDate",
      header: "End Date",
      enableColumnFilter: false,
      sortingFn: "datetime",
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
      size: 100,
    },
    {
      accessorKey: "dayOfBirth",
      header: "Date of Birth",
      enableColumnFilter: false,
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
      size: 100,
    },
    {
      accessorKey: "graduationDate",
      header: "Approx Graduation Date",
      Cell: ({ cell }) => cell.getValue<Date>()?.toLocaleDateString(), //render Date as a string
      size: 100,
    },
    {
      accessorKey: "hoursPerWeek",
      header: "Hr/w",
      size: 50,
    },
    { accessorKey: "university", header: "University" },
    { accessorKey: "semester", header: "Semester" },
    {
      accessorKey: "participatedAtWizeline",
      header: "Knows Wizeline",
      filterVariant: "checkbox",
      size: 50,
    },
    {
      accessorKey: "status",
      header: "Status",
      size: 100,
      filterVariant: "multi-select",
      filterSelectOptions: ["DRAFT", "HOLD", "APPROVED", "REJECTED"],
    },
    {
      accessorKey: "appliedProjects",
      header: "Applied Projects",
    },
  ];

  const table = useMaterialReactTable({
    columns,
    data: applicants,
    initialState: {
      columnVisibility: {
        email: false,
        universityEmail: false,
        dayOfBirth: false,
        graduationDate: false,
        semester: false,
        participatedAtWizeline: false,
        appliedProjects: false,
      },
    }, //hide firstName column by default
  });

  return (
    <>
      <Header title="Applicants" />
      <NavAppBar title="Internship Applicants" />
      <Container>
        <Paper sx={{ p: 2 }}>
          {/* <h1 style={{ marginTop: 0 }}>Applicants</h1> */}
          <MaterialReactTable table={table} />
        </Paper>
      </Container>
    </>
  );
}
