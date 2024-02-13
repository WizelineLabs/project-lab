import ConfirmationModal from "../core/components/ConfirmationModal";
import {
  Add as AddIcon,
  Cancel as CancelIcon,
  Delete as DeleteIcon,
  Save as SaveIcon,
} from "@mui/icons-material";
import { Button } from "@mui/material";
import type { GridRenderCellParams } from "@mui/x-data-grid";
import { DataGrid, GridToolbarContainer } from "@mui/x-data-grid";
import type {
  LoaderFunction,
  ActionFunction,
  MetaFunction,
} from "@remix-run/node";
import { json } from "@remix-run/node";
import {
  useFetcher,
  useLoaderData,
  useRouteError,
  isRouteErrorResponse,
} from "@remix-run/react";
import React, { useState, useEffect } from "react";
import invariant from "tiny-invariant";
import {
  getAdminUsers,
  addAdminUser,
  removeAdminUser,
} from "~/models/user.server";

interface LoaderData {
  admins: Awaited<ReturnType<typeof getAdminUsers>>;
}

interface AdminRecord {
  id: number | string;
  name: string | null;
  email: string;
}

interface gridEditToolbarProps {
  setRows: React.Dispatch<React.SetStateAction<AdminRecord[]>>;
  createButtonText: string;
}

interface newAdmin {
  email: string;
}

export const loader: LoaderFunction = async () => {
  const admins = await getAdminUsers();
  return json<LoaderData>({
    admins,
  });
};

export const meta: MetaFunction = () => {
  return [
    { title: "Wizelabs - Admins" },
    { name: "description", content: "This is the Manager's Admin Tab" },
  ];
};

export const action: ActionFunction = async ({ request }) => {
  const formData = await request.formData();

  const action = formData.get("action");
  let response;

  if (action === "POST") {
    const email = formData.get("email") as string;
    invariant(email, "Invalid email address");
    response = await addAdminUser({ email });
    if (response.error) {
      return json({ error: response.error }, { status: 404 });
    }
    return json(response, { status: 201 });
  } else if (action === "DELETE") {
    const id = formData.get("id") as string;
    invariant(id, "User Id is required");
    response = await removeAdminUser({ id });
    if (response.error) {
      return json({ error: response.error }, { status: 400 });
    }
    return json(response, { status: 200 });
  } else {
    throw new Error("Something went wrong");
  }
};

const GridEditToolbar = (props: gridEditToolbarProps) => {
  const { setRows, createButtonText } = props;

  const handleAddClick = () => {
    const id = "new-value";
    const newName = "";
    const newEmail = "";
    setRows((prevRows) => {
      if (prevRows.find((rowValue) => rowValue.id === "new-value")) {
        return [...prevRows];
      }
      return [
        ...prevRows,
        { id, name: newName, email: newEmail, isNew: true },
      ] as AdminRecord[];
    });
  };
  return (
    <GridToolbarContainer>
      <Button
        variant="contained"
        color="primary"
        startIcon={<AddIcon />}
        onClick={() => handleAddClick()}
        data-testid="testAdminCreate"
      >
        {createButtonText}
      </Button>
    </GridToolbarContainer>
  );
};

export default function AdminsDataGrid() {
  const fetcher = useFetcher<typeof action>();
  const { admins } = useLoaderData<typeof loader>();
  const [error, setError] = useState<string>("");
  const createButtonText = "Add New Admin";
  const [rows, setRows] = useState<AdminRecord[]>(() =>
    admins
      ? admins.map((item: AdminRecord) => ({
          id: item.id,
          name: item.name,
          email: item.email,
        }))
      : []
  );

  // handle Delete Admin variables
  const [selectedRowID, setSelectedRowID] = useState("");
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

  useEffect(() => {
    //It handles the fetcher error from the response
    if (fetcher.state === "idle" && fetcher.data) {
      if (fetcher.data.error) {
        setError(fetcher.data.error);
      } else {
        setError("");
      }
    }
  }, [fetcher]);

  useEffect(() => {
    //It changes the rows shown based on admins
    setRows(
      admins.map((item: AdminRecord) => ({
        id: item.id,
        name: item.name,
        email: item.email,
      }))
    );
  }, [admins]);

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

  //Add new Admin
  const addNewAdminUser = async (values: newAdmin) => {
    try {
      const body = {
        ...values,
        action: "POST",
      };
      await fetcher.submit(body, { method: "post" });
    } catch (error: any) {
      console.error(error);
      setError(error.toString());
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
    setError("");
  };

  const handleSaveClick = async (idRef: GridRenderCellParams) => {
    const id = idRef.row.id;

    const row = idRef.api.getRow(id);
    const isValid = await idRef.api.commitRowChange(idRef.row.id);
    const newEmail = idRef.api.getCellValue(id, "email");

    if (rows.find((rowValue) => rowValue.email === newEmail)) {
      console.error("Field Already exists");
      setError("Error: User is already an admin");
      return;
    } else {
      console.error("All fields are valid");
    }

    if (row.isNew && isValid) {
      const newValues = { email: newEmail };
      idRef.api.setRowMode(id, "view");
      addNewAdminUser(newValues);
      setRows((prevRows) => prevRows.filter((row) => row.id !== "new-value"));
      return;
    }
  };

  //Delete Admin
  const deleteConfirmationHandler = async () => {
    setOpenDeleteModal(false);
    try {
      const body = {
        id: selectedRowID,
        action: "DELETE",
      };
      await fetcher.submit(body, { method: "delete" });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDeleteClick = (idRef: GridRenderCellParams) => {
    const id = idRef.row.id;
    setSelectedRowID(() => id);
    setOpenDeleteModal(() => true);
  };

  const columns = [
    { field: "email", headerName: "Email", width: 300, editable: true },
    { field: "name", headerName: "Name", width: 300, editable: false },
    {
      field: "actions",
      headerName: "Actions",
      width: 300,
      renderCell: (idRef: GridRenderCellParams) => {
        if (idRef.row.id === "new-value") {
          idRef.api.setRowMode(idRef.row.id, "edit");
          idRef.api.setCellFocus(idRef.row.id, "email");
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
                data-testid="testAdminSave"
              >
                <SaveIcon color="inherit" />
              </Button>
            </>
          );
        }
        return (
          <Button
            variant="contained"
            color="warning"
            size="small"
            onClick={() => handleDeleteClick(idRef)}
            style={{ marginLeft: 16 }}
            data-testid="testAdminDelete"
          >
            <DeleteIcon color="inherit" />
          </Button>
        );
      },
    },
  ];

  return (
    <>
      <div style={{ display: "flex", width: "100%", height: "70vh" }}>
        <div style={{ flexGrow: 1 }}>
          {error ? <p style={{ color: "red" }}>{error}</p> : null}
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
      {/* Confirmation for deletion */}
      <ConfirmationModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
        label="Remove"
        className="warning"
        disabled={false}
        onClick={async () => {
          deleteConfirmationHandler();
        }}
      >
        <h2 data-testid="deleteAdminModal">
          Are you sure you want to remove the Admin role from{" "}
          {rows[rows.findIndex((row) => row.id === +selectedRowID)]?.email}?
        </h2>
        <br />
      </ConfirmationModal>
    </>
  );
}

export function ErrorBoundary() {
  const error = useRouteError() as Error;
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>Admin not found</div>;
  }

  return <div>An unexpected error occurred: {error.message}</div>;
}
