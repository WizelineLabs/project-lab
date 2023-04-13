import React, { useState, useEffect } from "react";
import { useFetcher, useCatch, useLoaderData, useTransition } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import ConfirmationModal from "../../../core/components/ConfirmationModal";
import {
  getLabels,
  addLabel,
  removeLabel,
  updateLabel,
} from "~/models/label.server";
import { Card, CardContent, CardHeader, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import ModalBox from "~/core/components/ModalBox";
import LabeledTextField from "~/core/components/LabeledTextField";
import { Stack } from "@mui/system";
import { redirect } from "remix-typedjson";
import invariant from "tiny-invariant";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true;
    secondaryC: true;
  }
}

export const validator = withZod(
  z.object({
    id: z.string().optional(),
    name: z
      .string()
      .min(1, { message: "Name is required" }),
  })
);

type LabelRecord = {
  id: string ;
  name: string;
};

type LoaderData = {
  labels: Awaited<ReturnType<typeof getLabels>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const labels = await getLabels();
  return json<LoaderData>({
    labels,
  });
};

export const action: ActionFunction = async ({ request, params }) => {
  
  const result = await validator.validate(await request.formData());
  const id = result.data?.id;
  const name = result.data?.name as string;
  if (result.error != undefined) return validationError(result.error);

  if(request.method == "POST") {   
      const response = await addLabel({ name });
      return json(response, { status: 201 });
  } 

  if( request.method == 'PUT') {
    if(id){
      try{
        await updateLabel({id, name})
        return redirect("./");
      } catch (e) {
        throw e;
      }
    }else{
      invariant(id, "Label Id is required");
    }
  }

  if(request.method == "DELETE") {
    if(id) {
      try{
        await removeLabel({ id });
        return redirect("./");

      } catch (e) {
        throw e;
      }
      
    }
}
 
};


export default function LabelsDataGrid() {
  const fetcher = useFetcher();
  const { labels } = useLoaderData() as LoaderData;
  const createButtonText = "Create New Label";
  const [rows, setRows] = useState<LabelRecord[]>([]);

  useEffect(() => {
    //It changes the rows shown based on admins
    setRows(
      labels.map((item: LabelRecord) => ({
        id: item.id,
        name: item.name,
      }))
    );
  }, [labels]);  

  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [openModifyModal, setOpenModifyModal] = useState<boolean>(false);
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [selectedRowID, setSelectedRowID] = useState("");
  const [selectedName, setSelectedName] = useState("");


  const transition = useTransition();

  useEffect(() => {
    if (transition.type == "actionReload" || transition.type == "actionSubmission") {
      setOpenCreateModal(false);
      setOpenModifyModal(false);
    }
  }, [transition]);

  const handleAddClick = () => {
    setOpenCreateModal(() => true);
  };

  // Delete label
  const deleteConfirmationHandler = async () => {
    setOpenDeleteModal(false);
    try {
      const body = {
        id: selectedRowID,
        name: selectedName,
        action: "DELETE",
      };
      await fetcher.submit(body, { method: "delete" });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDeleteClick = (id: string, name: string) => {
    setSelectedRowID(() => id);
    setSelectedName(() => name);
    setOpenDeleteModal(() => true);
  };

  const handleModifyClick = (id: string, name: string) => {
    setSelectedRowID(() => id);
    setSelectedName(() => name)
    setOpenModifyModal(() => true)
  }

  interface HeadLabelsData {
    id: keyof LabelRecord;
    label: string;
    numeric: boolean;
  }

  const headCells: HeadLabelsData[] = [
    {
      id: "name",
      numeric: false,
      label: "Name",
    },
    {
      id: "id",
      numeric: false,
      label: "Actions",
    },
  ];


  return (
    <>
    <Container sx={{ marginBottom: 2 }}>
    <Card>
      <CardHeader
        title="Labels"
        action={
          <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleAddClick()}
          data-testid="testLabelCreate"
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
                         scope="row"
                         align="center">
                            <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleModifyClick(row.id, row.name)}
                            style={{ marginLeft: 16 }}
                          >
                            <EditIcon color="inherit" />
                          </Button>
                          <Button
                            variant="contained"
                            color="warning"
                            size="small"
                            onClick={() => handleDeleteClick(row.id, row.name)}
                            style={{ marginLeft: 16 }}
                            data-testid="testLabelDelete"
                          >
                            <DeleteIcon color="inherit" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    )}
              )
            }
            </TableBody>
        </Table>
      </TableContainer>
      </CardContent>
      </Card>
    </Container>
      {/* Confirmation for deletion */}
      <ConfirmationModal
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
        label="Delete"
        className="warning"
        disabled={false}
        onClick={async () => {
          deleteConfirmationHandler();
        }}
      >
        <h2 data-testid="deleteLabelModal">
          Are you sure you want to delete this Label ?
        </h2>
        <p>This action cannot be undone.</p>
        <br />
      </ConfirmationModal>

      {/* Modify Modal */}
      <ModalBox open={openModifyModal} close={() => setOpenModifyModal(false)}>
       
        <h2 data-testid="deleteLabelModal">
         Modifying label
        </h2>
 
        <ValidatedForm action='./' method="put" validator={validator} defaultValues={{
              name:selectedName
            }}>
          <Stack spacing={2}>
            <input type="hidden" name="id" value={selectedRowID} />
            <LabeledTextField fullWidth name="name" label="Name" />
            <div>
              <Button variant="contained" onClick={() => setOpenModifyModal(false)}>
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

      {/* Create Label Modal */}
      <ModalBox open={openCreateModal} close={() => setOpenCreateModal(false)}>
        <h2 data-testid="createNewLabel">
         Create new label
        </h2>
        <ValidatedForm action='./' method="post" validator={validator}>
          <Stack spacing={2}>
          <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />

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
  return <div>An unexpected error occurred: {error.message}</div>;
}

export function CatchBoundary() {
  const caught = useCatch();

  if (caught.status === 404) {
    return <div>Label not found</div>;
  }

  throw new Error(`Unexpected caught response with status: ${caught.status}`);
}
