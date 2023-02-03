import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useCatch } from "@remix-run/react";
import type { LoaderFunction, ActionFunction } from "@remix-run/node";
import {
  ValidatedForm,
  validationError,
  useFieldArray,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { json } from "@remix-run/node";
import styled from "@emotion/styled";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Close";
import EastIcon from "@mui/icons-material/East";
import invariant from "tiny-invariant";
import { InputSelect } from "app/core/components/InputSelect";
import { InputSelectWOValidate } from "app/core/components/InputSelectWOValidate";
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

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true;
    secondaryC: true;
  }
}

type StatusRecord = {
  id: number | string;
  name: string | null;
  stage: string | null;
};

type gridEditToolbarProps = {
  setRows: React.Dispatch<React.SetStateAction<StatusRecord[]>>;
  createButtonText: string;
};

type LoaderData = {
  statuses: Awaited<ReturnType<typeof getProjectStatuses>>;
  projects: Awaited<ReturnType<typeof getProjects>>;
};

type newStatus = {
  name: string;
  stage?: string;
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
  const formData = await request.formData();

  let action = formData.get("action");
  let response, name, stage, data;
  const subaction = formData.get("subaction");
  if (subaction) action = subaction;

  try {
    switch (action) {
      case "POST":
        name = formData.get("name") as string;
        stage = formData.get("stage") as string;
        invariant(name, "Invalid project status name");
        data = {
          name,
          ...(stage ? { stage } : null),
        };
        response = await addProjectStatus(data);
        return json(response, { status: 201 });

      case "DELETE":
        name = formData.get("name") as string;
        invariant(name, "Project status name is required");
        response = await removeProjectStatus({ name });
        return json({ error: "" }, { status: 200 });

      case "UPDATE":
        const id = formData.get("id") as string;
        name = formData.get("name") as string;
        stage = formData.get("stage") as
          | "idea"
          | "ongoing project"
          | "none"
          | null;
        invariant(name, "Invalid project status name");
        data = {
          id,
          name,
          ...(stage ? { stage } : null),
        };
        await updateProjectStatus(data);
        return json({ error: "" }, { status: 200 });

      case "UPDATE-PROJECTS":
        const result = await validatorBack.validate(formData);
        if (result.error) return validationError(result.error);
        const ids = result.data.ids as string[];
        const projectStatus = result.data.status?.name;
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

const GridEditToolbar = (props: gridEditToolbarProps) => {
  const { setRows, createButtonText } = props;
  const handleAddClick = () => {
    const id = "new-value";
    const newName = "";
    const newStage = "";
    setRows((prevRows) => {
      if (prevRows.find((rowValue) => rowValue.id === "new-value")) {
        return [...prevRows];
      }
      return [...prevRows, { id, name: newName, stage: newStage, isNew: true }];
    });
  };
  return (
    <GridToolbarContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleAddClick()}
        data-testid="testStatusCreate"
      >
        {createButtonText}
      </Button>
    </GridToolbarContainer>
  );
};

export default function ProjectStatusDataGrid() {
  const fetcher = useFetcher();
  const { statuses } = useLoaderData() as LoaderData;
  const createButtonText = "Create New Status";
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
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

  const handleRowEditStart = (event: any) => {
    event.defaultMuiPrevented = true;
  };

  const handleRowEditStop = (event: any) => {
    event.defaultMuiPrevented = true;
  };

  const handleCellFocusOut = (event: any) => {
    event.defaultMuiPrevented = true;
  };

  const handleEditClick = (idRef: GridRenderCellParams) => {
    idRef.api.setRowMode(idRef.row.id, "edit");
  };

  // Add new project status
  const createNewProjectStatus = async (values: newStatus) => {
    try {
      const body = {
        ...values,
        action: "POST",
      };
      await fetcher.submit(body, { method: "post" });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleSaveClick = async (idRef: GridRenderCellParams) => {
    const id = idRef.row.id;

    const row = idRef.api.getRow(id);
    const isValid = await idRef.api.commitRowChange(idRef.row.id);
    const newName = idRef.api.getCellValue(id, "name");
    const newStage = idRef.api.getCellValue(id, "stage");

    if (statuses.find((rowValue) => rowValue.name === newName) && row.isNew) {
      setError("Field Already exists");
      return;
    }

    if (!newName) {
      setError("Field Name is required");
      return;
    }

    if (row.isNew && isValid) {
      const newValues = { name: newName, stage: newStage };
      idRef.api.setRowMode(id, "view");
      await createNewProjectStatus(newValues);
      return;
    }
    if (isValid) {
      const row = idRef.api.getRow(idRef.row.id);
      let id = idRef.row.id;
      await editProjectStatusInfo(id, { name: newName, stage: newStage });
      idRef.api.updateRows([{ ...row, isNew: false }]);
      idRef.api.setRowMode(id, "view");
    }
  };

  const handleCancelClick = async (idRef: GridRenderCellParams) => {
    const id = idRef.row.id;
    idRef.api.setRowMode(id, "view");

    const row = idRef.api.getRow(id);
    if (row && row.isNew) {
      await idRef.api.updateRows([{ id, _action: "delete" }]);
      setRows((prevRows) => {
        const rowToDeleteIndex = prevRows.length - 1;
        return [
          ...rows.slice(0, rowToDeleteIndex),
          ...rows.slice(rowToDeleteIndex + 1),
        ];
      });
    }
    setRows(
      statuses.map((item: ProjectStatus) => ({
        id: item.name,
        name: item.name,
        stage: item.stage,
      }))
    );
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

  const handleDeleteClick = async (idRef: GridRenderCellParams) => {
    let id = idRef.row.id;
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

  // Edit project status
  const editProjectStatusInfo = async (id: string, values: newStatus) => {
    try {
      const body = {
        id,
        ...values,
        action: "UPDATE",
      };
      await fetcher.submit(body, { method: "put" });
    } catch (error: any) {
      console.error(error);
    }
  };

  const columns = [
    { field: "name", headerName: "Name", width: 300, editable: true },
    {
      field: "stage",
      headerName: "Stage",
      width: 300,
      cellClassName: "actions",
      renderCell: (idRef: any) => {
        const handleChangeStage = (newValue: { name: string }) => {
          const currValue = statuses.find(
            (status) => status.name === idRef.row.id
          )?.stage;
          if (currValue !== newValue.name)
            idRef.api.setRowMode(idRef.row.id, "edit");

          setRows((prevValues) =>
            prevValues.map((v) =>
              v.id === idRef.row.id
                ? {
                    ...v,
                    stage: newValue.name,
                  }
                : v
            )
          );
        };
        return (
          <InputSelectWOValidate
            valuesList={stageOptions}
            defaultValue=""
            name="stage"
            label="Stage"
            disabled={false}
            value={idRef.row.stage || "none"}
            handleChange={handleChangeStage}
          />
        );
      },
    },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      cellClassName: "actions",
      renderCell: (idRef: any) => {
        if (idRef.row.id === "new-value") {
          idRef.api.setRowMode(idRef.row.id, "edit");
          idRef.api.setCellFocus(idRef.row.id, "name");
        }
        const isInEditMode = idRef.api.getRowMode(idRef.row.id) === "edit";
        if (isInEditMode) {
          return (
            <>
              <Button
                variant="contained"
                color="primary"
                size="small"
                onClick={() => handleCancelClick(idRef)}
                style={{ marginLeft: 16 }}
              >
                <CancelIcon color="inherit" />
              </Button>

              <Button
                variant="contained"
                color="secondary"
                size="small"
                onClick={() => handleSaveClick(idRef)}
                style={{ marginLeft: 16 }}
                data-testid="testStatusSave"
              >
                <SaveIcon color="inherit" />
              </Button>
            </>
          );
        }
        return (
          <>
            <Button
              variant="contained"
              color="secondary"
              size="small"
              onClick={() => handleEditClick(idRef)}
              style={{ marginLeft: 16 }}
            >
              <EditIcon color="inherit" />
            </Button>
            <Button
              variant="contained"
              color="primary"
              size="small"
              onClick={() => handleDeleteClick(idRef)}
              style={{ marginLeft: 16 }}
              data-testid="testStatusDelete"
            >
              <EastIcon color="inherit" />
            </Button>
          </>
        );
      },
    },
  ];

  const isMergeAction = projects.length > 0;

  return (
    <div>
      <h2>Statuses</h2>
      <div style={{ display: "flex", width: "100%", height: "70vh" }}>
        <div style={{ flexGrow: 1 }}>
          {error && <p style={{ color: "red" }}>{error}</p>}
          <DataGrid
            rows={rows}
            columns={columns}
            rowsPerPageOptions={[50]}
            pageSize={50}
            editMode="row"
            onRowEditStart={handleRowEditStart}
            onRowEditStop={handleRowEditStop}
            onCellFocusOut={handleCellFocusOut}
            components={{
              Toolbar: GridEditToolbar,
            }}
            componentsProps={{
              toolbar: { setRows, createButtonText },
            }}
          />
        </div>
      </div>
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
            method="put"
            subaction="UPDATE-PROJECTS"
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
    </div>
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
