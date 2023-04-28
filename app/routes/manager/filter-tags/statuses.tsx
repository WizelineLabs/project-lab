import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useCatch, useTransition } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import {
  ValidatedForm,
  validationError,
  useFieldArray,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { json } from "@remix-run/node";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import EastIcon from "@mui/icons-material/East";
import invariant from "tiny-invariant";
import { InputSelect } from "app/core/components/InputSelect";
import ModalBox from "../../../core/components/ModalBox";
import {
  getProjectStatuses,
  addProjectStatus,
  removeProjectStatus,
  updateProjectStatus,
} from "~/models/status.server";
import type { ProjectStatus } from "~/models/status.server";
import { getProjects, updateManyProjects } from "~/models/project.server";
import { stageOptions } from "~/constants";
import { Container } from "@mui/system";
import { Card, CardContent, CardHeader, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import LabeledTextField from "~/core/components/LabeledTextField";
import { z } from "zod";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true;
    secondaryC: true;
  }
}

type StatusRecord = {
  id: string;
  name: string;
  stage: string | null;
};

export const validator = withZod(
  zfd
    .formData({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, { message: "Name is required" }),
    stage:z.object({ name: z.string().optional() }).optional(),
  }),

);

type LoaderData = {
  statuses: Awaited<ReturnType<typeof getProjectStatuses>>;
  projects: Awaited<ReturnType<typeof getProjects>>;
};

type ProjectRecord = {
  id: number | string;
  name: string | null;
};

const validatorFront = withZod(
  zfd.formData({
    status: z.object({ name: z.string() }).optional(),
  })
);

const validatorBack = withZod(
  zfd.formData({
    status: z.object({ name: z.string() }).optional(),
    ids: z.array(z.union([z.string(), z.number()])),
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
  let result = await validator.validate(await request.formData());
  const id = result.data?.id as string;
  const name = result.data?.name as string;
  let stage;
  let response;
  if (result.error != undefined) return validationError(result.error);
  const action = request.method;

  try {
    switch (action) {
      case "POST":
        stage = result.data?.stage?.name
        invariant(name, "Invalid project status name");
        response = await addProjectStatus({name, stage});
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
        await updateProjectStatus({id, name, stage});
        return json({ error: "" }, { status: 200 });

      case "UPDATE-PROJECTS":
        let updateResult = await validatorBack.validate(await request.formData());
        if (updateResult.error) return validationError(updateResult.error);
        const ids = updateResult.data.ids as string[];
        const projectStatus = updateResult.data.status?.name;
        invariant(projectStatus, "Project status is required");
        await updateManyProjects({ ids, data: { status: projectStatus } });
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

export default function ProjectStatusDataGrid() {
  const fetcher = useFetcher();
  const { statuses } = useLoaderData() as LoaderData;
  const createButtonText = "Create New Status";
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openEditModal, setOpenEditModal] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [error, setError] = useState<string>("");
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

  const transition = useTransition();

  useEffect(() => {
    if (transition.type == "actionReload" || transition.type == "actionSubmission") {
      setOpenCreateModal(false);
      setOpenEditModal(false);
    }
  }, [transition]);

  

  const handleAddClick = () => {
    setOpenCreateModal(true)
  };
  

  useEffect(() => {
    //It handles the fetcher error from the response
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.error) {
        setError(fetcher.data.error);
      } else {
        setError("");
      }

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
    let id = idRef as string;
    const body = {
      projectStatus: id,
    };
    await fetcher.submit(body, { method: "get" });
    setSelectedRowID(() => id);
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
      <h2>Statuses</h2>
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
          data-testid="StatusCreate"
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
                    <TableSortLabel >
                      {cell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableHead>
              <TableBody>
                {
                  rows.map(
                    (row, index) => {
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
                      )
                    }
                  )
                }
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
            {isMergeAction && (
              <InputSelect
                valuesList={statuses.filter(
                  (status) => status.name !== selectedRowID
                )}
                name="status"
                label="Status to merge with"
                disabled={false}
              />
            )}
            {items.map((item, idx) => (
              <input
                key={item}
                type="hidden"
                name={`ids[${idx}]`}
                value={item}
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
        <h2 data-testid="createNewLabel">
         Edit  status
        </h2>
        <ValidatedForm action='./' method="put" validator={validator} 
        defaultValues={{
          name: selectedRowID
        }}>
          <input type="hidden" name="id" value={selectedRowID} />
          <Stack spacing={2}>
          <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />
          <InputSelect
            valuesList={stageOptions}
            name="stage"
            label="Select a stage"
            disabled={false}
          />
          <div>
            <Button variant="contained" onClick={() => setOpenEditModal(false)}>
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
        <h2 data-testid="editStatusLabel">
         Create new status
        </h2>
        <ValidatedForm action='./' method="post" validator={validator}>
          <Stack spacing={2}>
          <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />
          
          <InputSelect
            valuesList={stageOptions}
            name="stage"
            label="Select a stage"
            disabled={false}
          />
          <div>
            <Button variant="contained" onClick={() => setOpenCreateModal(false)}>
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

export function ErrorBoundary({ error }: { error: Error }) {
  console.error(error);

  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>ProjectStatus not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
