import { useState, useEffect } from "react";
import { useLoaderData, useNavigation, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { json } from "@remix-run/node";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import {
  getPointsOfContact,
  addPointOfContact,
  updatePointOfContact,
} from "~/models/pointsOfContact.server";
import { Card, CardContent, CardHeader, Container, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import { ValidatedForm, validationError } from "remix-validated-form";
import { z } from "zod";
import { withZod } from "@remix-validated-form/with-zod";
import ModalBox from "~/core/components/ModalBox";
import LabeledTextField from "~/core/components/LabeledTextField";
import { Stack } from "@mui/system";
import { redirect } from "remix-typedjson";
import invariant from "tiny-invariant";
import { validateNavigationRedirect } from '~/utils'
import { getUniversities } from "~/models/university.server";
import InputSelect from "~/core/components/InputSelect";

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true;
    secondaryC: true;
  }
}

export const validator = withZod(
  z.object({
    id: z.string().optional(),
    fullName: z
      .string()
      .min(1, { message: "Name is required" }),
    university: z.object({
      name: z.string()
    })
  })
);

type PointOfContact = {
  id: string ;
  fullName: string;
  university: {
    name: string
  }
};

type PointOfContactRecord = {
  id: string ;
  fullName: string;
  university: string
};

type LoaderData = {
  pointsOfContact: Awaited<ReturnType<typeof getPointsOfContact>>;
  universities: Awaited<ReturnType<typeof getUniversities>>;
};

export const loader: LoaderFunction = async ({ request }) => {
  const pointsOfContact = await getPointsOfContact();
  const universities = await getUniversities();
  return json<LoaderData>({
    pointsOfContact,
    universities
  });
};

export const action: ActionFunction = async ({ request }) => {
  
  const result = await validator.validate(await request.formData());
  const id = result.data?.id;
  const name = result.data?.fullName as string;
  const university = result.data?.university as {id: string, name:string};
  if (result.error != undefined) return validationError(result.error);

  if(request.method == "POST") {   
      const response = await addPointOfContact({ 
        fullName: name,
        university: {
          connectOrCreate: {
            create: {
              name: university?.name ?? "",
            },
            where: {
              name: university?.name
            }, 
          }
        }
      });
      return json(response, { status: 201 });
  } 

  if( request.method == 'PUT') {
    if(id){
      try{
        await updatePointOfContact({id, fullName : name, university: university.name})
        return redirect("./");
      } catch (e) {
        throw e;
      }
    }else{
      invariant(id, "University Id is required");
    }
  }
 
};

function PointOfContactDataGrid() {
  const { pointsOfContact, universities } = useLoaderData() as LoaderData;
  const createButtonText = "Add New Point of Contact";
  const [rows, setRows] = useState<PointOfContactRecord[]>([]);

  useEffect(() => {
    setRows(
      pointsOfContact.map((item: PointOfContact) => ({
        id: item.id,
        fullName: item.fullName,
        university: item.university.name        
      }))
    );
  }, [pointsOfContact]);  

  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);
  const [openModifyModal, setOpenModifyModal] = useState<boolean>(false);
  const [selectedRowID, setSelectedRowID] = useState("");
  const [selectedName, setSelectedName] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");

  const navigation = useNavigation();

  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation)
    if (isActionRedirect) {
      setOpenCreateModal(false);
      setOpenModifyModal(false);
    }
  }, [navigation]);

  const handleAddClick = () => {
    setOpenCreateModal(() => true);
  };

  const handleModifyClick = (id: string, name: string, university : any) => {
    setSelectedRowID(() => id);
    setSelectedName(() => name);
    setSelectedUniversity(() => university);
    setOpenModifyModal(() => true);
  }

  interface HeadUniversitiesData {
    id: keyof PointOfContactRecord;
    label: string;
    numeric: boolean;
    align: "left" | "right" | "inherit" | "center" | "justify" | undefined;
  }

  const headCells: HeadUniversitiesData[] = [
    {
      id: "fullName",
      numeric: false,
      label: "Name",
      align: "left"
    },
    {
      id: "university",
      numeric: false,
      label: "University",
      align: "left"
    },
    {
      id: "id",
      numeric: false,
      label: "Actions",
      align: "right"
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
                  <TableCell key={cell.id} align={cell.align} padding="normal">
                    <TableSortLabel >
                      {cell.label}
                    </TableSortLabel>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {
                rows.map(
                  (row, index) => {
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
                         scope="row"
                         align="right">
                            <Button
                            variant="contained"
                            size="small"
                            onClick={() => handleModifyClick(row.id, row.fullName, row.university)}
                            style={{ marginLeft: 16 }}
                            data-testid="testPointOfContactEdit"
                          >
                            <EditIcon color="inherit" />
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
      {/* Modify Modal */}
      <ModalBox open={openModifyModal} close={() => setOpenModifyModal(false)}>
       
        <h2 data-testid="testEditUniversityModal">
         Modifying point of contact
        </h2>
 
        <ValidatedForm action='./' method="put" validator={validator} defaultValues={{
              fullName:selectedName,
              university: {name: selectedUniversity}
            }}>
          <Stack spacing={2}>
            <input type="hidden" name="id" value={selectedRowID} />
            <LabeledTextField fullWidth name="fullName" label="Name" placeholder="Name" />
            <InputSelect
              valuesList={universities || []}
              name="university"
              label="University"
            />

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

      {/* Create University Modal */}
      <ModalBox open={openCreateModal} close={() => setOpenCreateModal(false)}>
        <h2 data-testid="testCreateNewUniversityModal">
        {createButtonText}
        </h2>
        <ValidatedForm action='./' method="post" validator={validator}>
          <Stack spacing={2}>
            <LabeledTextField fullWidth name="fullName" label="Name" placeholder="Name" />
            <InputSelect
              valuesList={universities || []}
              name="university"
              label="University"
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

export default PointOfContactDataGrid;

export function ErrorBoundary() {
  const error = useRouteError() as Error
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>University not found</div>;
  }

  return <div>An unexpected error occurred: {error.message}</div>;
}

