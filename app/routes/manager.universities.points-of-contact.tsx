import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TableSortLabel,
} from "@mui/material";
import Button from "@mui/material/Button";
import Chip from "@mui/material/Chip";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useLoaderData,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { useState, useEffect } from "react";
import { redirect } from "remix-typedjson";
import { ValidatedForm, validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import InputSelect from "~/core/components/InputSelect";
import { LabeledCheckbox } from "~/core/components/LabeledCheckbox";
import LabeledTextField from "~/core/components/LabeledTextField";
import ModalBox from "~/core/components/ModalBox";
import {
  getPointsOfContact,
  addPointOfContact,
  updatePointOfContact,
} from "~/models/pointsOfContact.server";
import { getUniversities } from "~/models/university.server";
import { validateNavigationRedirect } from "~/utils";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true;
    secondaryC: true;
  }
}

export const validator = withZod(
  z.object({
    id: z.string().optional(),
    fullName: z.string().min(1, { message: "Name is required" }),
    university: z.string().min(1),
    active: z.string().optional(),
  })
);

interface PointOfContact {
  id: string;
  fullName: string;
  university: string;
  active: boolean;
}

interface LoaderData {
  pointsOfContact: Awaited<ReturnType<typeof getPointsOfContact>>;
  universities: Awaited<ReturnType<typeof getUniversities>>;
}

export const loader: LoaderFunction = async () => {
  const pointsOfContact = await getPointsOfContact();
  const universities = await getUniversities();
  return json<LoaderData>({
    pointsOfContact,
    universities,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const result = await validator.validate(await request.formData());
  const id = result.data?.id;
  const name = result.data?.fullName as string;
  const active = (result.data?.active as string) == "on";
  const university = result.data!.university;
  if (result.error != undefined) return validationError(result.error);

  if (request.method == "POST") {
    const response = await addPointOfContact({
      fullName: name,
      university,
    });
    return json(response, { status: 201 });
  }

  if (request.method == "PUT") {
    if (id) {
      await updatePointOfContact({
        id,
        fullName: name,
        university: university,
        active,
      });
      return redirect("./");
    } else {
      invariant(id, "University Id is required");
    }
  }
};

function PointOfContactDataGrid() {
  const { pointsOfContact, universities } = useLoaderData() as LoaderData;
  const createButtonText = "Add New Point of Contact";
  const [rows, setRows] = useState<PointOfContact[]>([]);

  useEffect(() => {
    setRows(
      pointsOfContact.map((item: PointOfContact) => ({
        id: item.id,
        fullName: item.fullName,
        university: item.university,
        active: item.active,
      }))
    );
  }, [pointsOfContact]);

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openModifyModal, setOpenModifyModal] = useState<boolean>(false);
  const [selectedRowID, setSelectedRowID] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedActive, setSelectedActive] = useState(true);
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation);
    if (isActionRedirect) {
      setOpenCreateModal(false);
      setOpenModifyModal(false);
    }
  }, [navigation]);

  const handleAddClick = () => {
    setOpenCreateModal(() => true);
  };

  const handleModifyClick = (
    id: string,
    name: string,
    university: string,
    active: boolean
  ) => {
    setSelectedRowID(() => id);
    setSelectedName(() => name);
    setSelectedActive(() => active);
    setSelectedUniversity(() => university);
    setOpenModifyModal(() => true);
  };

  interface HeadUniversitiesData {
    id: keyof PointOfContact;
    label: string;
    numeric: boolean;
    align: "left" | "right" | "inherit" | "center" | "justify" | undefined;
    hide?: boolean;
  }

  const headCells: HeadUniversitiesData[] = [
    {
      id: "fullName",
      numeric: false,
      label: "Name",
      align: "left",
    },
    {
      id: "university",
      numeric: false,
      label: "University",
      align: "left",
    },
    {
      id: "active",
      numeric: false,
      label: "Active",
      align: "center",
      hide: true,
    },
    {
      id: "id",
      numeric: false,
      label: "Actions",
      align: "right",
    },
  ];

  return (
    <>
      <Container sx={{ marginBottom: 2 }}>
        <Card>
          <CardHeader
            title="Points of Contact"
            action={
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleAddClick()}
                data-testid="testPoCCreate"
              >
                {createButtonText}
              </Button>
            }
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  <TableRow>
                    {headCells.map((cell) => (
                      <TableCell
                        key={cell.id}
                        align={cell.align}
                        padding="normal"
                      >
                        <TableSortLabel>{cell.label}</TableSortLabel>
                      </TableCell>
                    ))}
                  </TableRow>
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    const pointOfContactId = `enhanced-table-checkbox-${index}`;

                    return (
                      <TableRow hover tabIndex={0} key={index}>
                        <TableCell
                          component="th"
                          id={pointOfContactId}
                          scope="row"
                          align="left"
                        >
                          {row.fullName}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={pointOfContactId}
                          scope="row"
                          align="left"
                        >
                          {row.university}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={pointOfContactId}
                          scope="row"
                          align="center"
                        >
                          <Chip
                            label={row.active ? "ACTIVE" : "INACTIVE"}
                            disabled={!row.active}
                          ></Chip>
                        </TableCell>
                        <TableCell component="th" scope="row" align="right">
                          <Button
                            variant="contained"
                            size="small"
                            onClick={() =>
                              handleModifyClick(
                                row.id,
                                row.fullName,
                                row.university,
                                row.active
                              )
                            }
                            style={{ marginLeft: 16 }}
                            data-testid="testPointOfContactEdit"
                          >
                            <EditIcon color="inherit" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
      {/* Modify Modal */}
      <ModalBox open={openModifyModal} close={() => setOpenModifyModal(false)}>
        <h2 data-testid="testEditUniversityModal">
          Modifying point of contact
        </h2>

        <ValidatedForm
          action="./"
          method="put"
          validator={validator}
          defaultValues={{
            fullName: selectedName,
            active: selectedActive ? "on" : "",
            university: selectedUniversity,
          }}
        >
          <Stack spacing={2}>
            <input type="hidden" name="id" value={selectedRowID} />
            <LabeledTextField
              fullWidth
              name="fullName"
              label="Name"
              placeholder="Name"
            />
            <InputSelect
              valuesList={universities || []}
              name="university"
              label="University"
            />
            <LabeledCheckbox name="active" label="Active" />

            <div>
              <Button
                variant="contained"
                onClick={() => setOpenModifyModal(false)}
              >
                Cancel
              </Button>
              &nbsp;
              <Button type="submit" variant="contained">
                Modify
              </Button>
            </div>
          </Stack>
        </ValidatedForm>
      </ModalBox>

      {/* Create University Modal */}
      <ModalBox open={openCreateModal} close={() => setOpenCreateModal(false)}>
        <h2 data-testid="testCreateNewUniversityModal">{createButtonText}</h2>
        <ValidatedForm action="./" method="post" validator={validator}>
          <Stack spacing={2}>
            <LabeledTextField
              fullWidth
              name="fullName"
              label="Name"
              placeholder="Name"
            />
            <InputSelect
              valuesList={universities || []}
              name="university"
              label="University"
            />
            <div>
              <Button
                variant="contained"
                onClick={() => setOpenCreateModal(false)}
              >
                Cancel
              </Button>
              &nbsp;
              <Button type="submit" variant="contained" color="warning">
                Create
              </Button>
            </div>
          </Stack>
        </ValidatedForm>
      </ModalBox>
    </>
  );
}

export default PointOfContactDataGrid;

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>University not found</div>;
  }

  return <div>An unexpected error occurred: {error.message}</div>;
}
