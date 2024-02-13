import ModalBox from "../core/components/ModalBox";
import styled from "@emotion/styled";
import {
  Add as AddIcon,
  East as EastIcon,
  Edit as EditIcon,
} from "@mui/icons-material";
import {
  Button,
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
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useNavigation,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import { InputSelect } from "app/core/components/InputSelect";
import { useState, useEffect } from "react";
import {
  ValidatedForm,
  validationError,
  useFieldArray,
} from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { stageOptions } from "~/constants";
import LabeledTextField from "~/core/components/LabeledTextField";
import { getProjects } from "~/models/project.server";
import {
  getProjectStatuses,
  addProjectStatus,
  removeProjectStatus,
  updateProjectStatus,
} from "~/models/status.server";
import type { ProjectStatus } from "~/models/status.server";
import { validateNavigationRedirect } from "~/utils";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true;
    secondaryC: true;
  }
}

interface StatusRecord {
  id: string;
  name: string;
  stage: string | null;
}

export const validator = withZod(
  zfd.formData({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required" }),
    stage: z.object({ name: z.string().optional() }).optional(),
  })
);

interface LoaderData {
  statuses: Awaited<ReturnType<typeof getProjectStatuses>>;
  projects: Awaited<ReturnType<typeof getProjects>>;
}

interface ProjectRecord {
  id: number | string;
  name: string | null;
}

const validatorFront = withZod(
  zfd.formData({
    status: z.object({ name: z.string() }).optional(),
  })
);

const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const status = url.searchParams?.get("projectStatus");
  const statuses = await getProjectStatuses();
  const projects = await getProjects({ status });
  return json<LoaderData>({
    statuses,
    projects,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const result = await validator.validate(await request.formData());
  const id = result.data?.id as string;
  const name = result.data?.name as string;
  let stage;
  let response;
  if (result.error != undefined) return validationError(result.error);
  const action = request.method;

  try {
    switch (action) {
      case "POST":
        stage = result.data?.stage?.name;
        invariant(name, "Invalid project status name");
        response = await addProjectStatus({ name, stage });
        return json(response, { status: 201 });

      case "DELETE":
        invariant(name, "Project status name is required");
        response = await removeProjectStatus({ name });
        return json({ error: "" }, { status: 200 });

      case "PUT":
        stage = result.data?.stage?.name as
          | "idea"
          | "ongoing project"
          | "none"
          | null;
        invariant(name, "Invalid project status name");
        await updateProjectStatus({ id, name, stage });
        return json({ error: "" }, { status: 200 });

      default: {
        throw new Error("Something went wrong");
      }
    }
  } catch (e: any) {
    switch (e.code) {
      case "NOT_FOUND":
        return json({ error: e.message }, { status: 404 });
      default:
        throw e;
    }
  }
};

function ProjectStatusDataGrid() {
  const fetcher = useFetcher<typeof action>();
  const { statuses } = useLoaderData() as LoaderData;
  const createButtonText = "Create New Status";
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [rows, setRows] = useState<StatusRecord[]>(() =>
    statuses.map((item: ProjectStatus) => ({
      id: item.name,
      name: item.name,
      stage: item.stage,
    }))
  );
  const [selectedRowID, setSelectedRowID] = useState("");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [items, { push }] = useFieldArray("ids", {
    formId: "delete-status-form",
  });

  const navigation = useNavigation();

  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation);
    if (isActionRedirect) {
      setOpenCreateModal(false);
      setOpenEditModal(false);
    }
  }, [navigation]);

  const handleAddClick = () => {
    setOpenCreateModal(true);
  };

  useEffect(() => {
    //It handles the fetcher error from the response
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.projects) {
        setProjects(fetcher.data.projects);
      } else {
        setProjects([]);
      }
    }
  }, [fetcher]);

  useEffect(() => {
    //It changes the rows shown based on admins
    setRows(
      statuses.map((item: ProjectStatus) => ({
        id: item.name,
        name: item.name,
        stage: item.stage,
      }))
    );
  }, [statuses]);

  // Set handles for interactions

  const handleEditClick = (idRef: string) => {
    setSelectedRowID(() => idRef);
    setOpenEditModal(true);
  };

  // Delete project status
  const deleteConfirmationHandler = async () => {
    setOpenDeleteModal(false);
    try {
      const body = {
        name: selectedRowID,
        action: "DELETE",
      };
      await fetcher.submit(body, { method: "delete" });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDeleteClick = async (idRef: string | number) => {
    const id = idRef as string;
    const body = {
      projectStatus: id,
    };
    await fetcher.submit(body, { method: "get" });
    setSelectedRowID(id);
    setOpenDeleteModal(() => true);
  };

  const handleSubmit = async ({
    projectsIds,
  }: {
    projectsIds: (string | number)[];
  }) => {
    projectsIds.forEach((id) => push(id));

    await deleteConfirmationHandler();
  };

  interface HeadStatusData {
    id: keyof StatusRecord;
    label: string;
    numeric: boolean;
  }

  const headCells: HeadStatusData[] = [
    {
      id: "name",
      numeric: false,
      label: "Name",
    },
    {
      id: "stage",
      numeric: false,
      label: "Stage",
    },
    {
      id: "id",
      numeric: false,
      label: "Actions",
    },
  ];

  const isMergeAction = projects.length > 0;

  return (
    <>
      <Container sx={{ marginBottom: 2 }}>
        <Card>
          <CardHeader
            title="Statuses"
            action={
              <Button
                variant="contained"
                color="primary"
                startIcon={<AddIcon />}
                onClick={() => handleAddClick()}
                data-testid="testStatusCreate"
              >
                {createButtonText}
              </Button>
            }
          />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  {headCells.map((cell) => (
                    <TableCell key={cell.id} align="center" padding="normal">
                      <TableSortLabel>{cell.label}</TableSortLabel>
                    </TableCell>
                  ))}
                </TableHead>
                <TableBody>
                  {rows.map((row, index) => {
                    const labelId = `enhanced-table-checkbox-${index}`;
                    return (
                      <TableRow hover tabIndex={0} key={index}>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          align="center"
                        >
                          {row.name}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          align="center"
                        >
                          {row.stage}
                        </TableCell>
                        <TableCell
                          component="th"
                          id={labelId}
                          scope="row"
                          align="center"
                        >
                          <Button
                            variant="contained"
                            color="secondary"
                            size="small"
                            onClick={() => handleEditClick(row.id)}
                            style={{ marginLeft: 16 }}
                            data-testid="testStatusEdit"
                          >
                            <EditIcon color="inherit" />
                          </Button>
                          <Button
                            variant="contained"
                            color="primary"
                            size="small"
                            onClick={() => handleDeleteClick(row.id)}
                            style={{ marginLeft: 16 }}
                            data-testid="testStatusDelete"
                          >
                            <EastIcon color="inherit" />
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
      <ModalBox
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
      >
        <h2>Choose the status to merge {selectedRowID} with </h2>
        <p>This action will delete {selectedRowID}</p>
        <p>This action cannot be undone.</p>
        <br />
        <p>
          {projects.length < 1
            ? "There are no projects"
            : projects.length === 1
            ? "There is 1 project"
            : `There are ${projects.length} projects`}{" "}
          with this status
        </p>
        <br />
        <div>
          <ValidatedForm
            validator={validatorFront}
            onSubmit={async () => {
              await handleSubmit({
                projectsIds: projects.map((project) => project.id),
              });
            }}
            action="../merge/status"
            method="post"
            id="delete-status-form"
          >
            {isMergeAction ? (
              <InputSelect
                valuesList={statuses.filter(
                  (status: { name: string }) => status.name !== selectedRowID
                )}
                name="status"
                label="Status to merge with"
                disabled={false}
              />
            ) : null}
            {items.map((item, idx) => (
              <input
                key={item.key}
                type="hidden"
                name={`ids[${idx}]`}
                value={item.defaultValue}
              />
            ))}

            <ModalButtonsContainer>
              <Button
                className="primary default"
                onClick={() => setOpenDeleteModal(false)}
              >
                Cancel
              </Button>
              &nbsp;
              <Button
                className="primary warning"
                disabled={false}
                data-testid="deleteStatusModal"
                {...(isMergeAction
                  ? {
                      type: "submit",
                    }
                  : {
                      onClick: async () => {
                        await deleteConfirmationHandler();
                      },
                    })}
              >
                {isMergeAction ? "Merge" : "Delete"}
              </Button>
            </ModalButtonsContainer>
          </ValidatedForm>
        </div>
      </ModalBox>

      {/* edit status Modal */}
      <ModalBox open={openEditModal} close={() => setOpenEditModal(false)}>
        <h2 data-testid="testStatusEditModal">Edit status</h2>
        <ValidatedForm
          action="./"
          method="put"
          validator={validator}
          defaultValues={{
            name: selectedRowID,
          }}
        >
          <input type="hidden" name="id" value={selectedRowID} />
          <Stack spacing={2}>
            <LabeledTextField
              fullWidth
              name="name"
              label="Name"
              placeholder="Name"
            />
            <InputSelect
              valuesList={stageOptions}
              name="stage"
              label="Select a stage"
              disabled={false}
            />
            <div>
              <Button
                variant="contained"
                onClick={() => setOpenEditModal(false)}
              >
                Cancel
              </Button>
              &nbsp;
              <Button type="submit" variant="contained" color="warning">
                Modify
              </Button>
            </div>
          </Stack>
        </ValidatedForm>
      </ModalBox>

      {/* create status Modal */}
      <ModalBox open={openCreateModal} close={() => setOpenCreateModal(false)}>
        <h2 data-testid="testStatusCreateModal">Create new status</h2>
        <ValidatedForm action="./" method="post" validator={validator}>
          <Stack spacing={2}>
            <LabeledTextField
              fullWidth
              name="name"
              label="Name"
              placeholder="Name"
            />

            <InputSelect
              valuesList={stageOptions}
              name="stage"
              label="Select a stage"
              disabled={false}
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

export default ProjectStatusDataGrid;

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>ProjectStatus not found</div>;
  }

  return <div>An unexpected error occurred: {error.message}</div>;
}
