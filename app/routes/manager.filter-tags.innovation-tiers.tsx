import { useState, useEffect } from "react";
import { useFetcher, useLoaderData, useNavigation, useRouteError, isRouteErrorResponse } from "@remix-run/react";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import {
  ValidatedForm,
  useFieldArray,
} from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { json } from "@remix-run/node";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import EastIcon from "@mui/icons-material/East";
import invariant from "tiny-invariant";
import { InputSelect } from "app/core/components/InputSelect";
import ModalBox from "../core/components/ModalBox";
import {
  getInnovationTiers,
  addInnovationTier,
  removeInnovationTier,
  updateInnovationTier,
} from "~/models/innovationTier.server";
import { getProjects } from "~/models/project.server";
import { Card, CardContent, CardHeader, Container, Stack, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TableSortLabel } from "@mui/material";
import LabeledTextField from "~/core/components/LabeledTextField";
import { validateNavigationRedirect } from '~/utils'

declare module "@mui/material/Button" {
  interface ButtonPropsColorOverrides {
    secondaryB: true;
    secondaryC: true;
  }
}
type InnovationTierRecord = {
  id: string;
  name: string;
  benefits?: string;
  requisites?: string;
  goals?: string;
};

type LoaderData = {
  innovationTiers: Awaited<ReturnType<typeof getInnovationTiers>>;
  projects: Awaited<ReturnType<typeof getProjects>>;
};

type InnovationTierItem = Awaited<
  ReturnType<typeof getInnovationTiers>
>[number];

type ProjectRecord = {
  id: number | string;
  name: string | null;
};

const validatorFront = withZod(
  zfd.formData({
    id: z.string().optional(),
    name: z.string().min(1, { message: "Name is required"}),
    benefits: z.string().min(1, { message: "Benefits is required"}),
    goals: z.string().min(1, { message: "Goals is required"}),
    requisites: z.string().min(1, { message: "Requisites is required"}),
  })
);

const validatorForm = withZod(
  zfd.formData({
    name: z.object({ name: z.string() }).optional(),
    ids: z.array(z.union([z.string(), z.number()])).optional(),
  })
);

const ModalButtonsContainer = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const loader: LoaderFunction = async ({ request }) => {
  const url = new URL(request.url);
  const innovationTier = url.searchParams?.get("innovationTier");
  const innovationTiers = await getInnovationTiers();
  const projects = await getProjects({ tierName: innovationTier });
  return json<LoaderData>({
    innovationTiers,
    projects,
  });
};

export const action: ActionFunction = async ({ request }) => {
  const result = await validatorFront.validate(await request.formData());
  let action = result.submittedData.action;
  let response;
  let name, benefits, requisites, goals, id;
  const subaction = result.submittedData.subaction;
  const data = result.data;
  if (subaction) action = subaction;
  try {
    switch (action) {
      case "ADD":
        name = data?.name;
        benefits = data?.benefits;
        requisites = data?.requisites;
        goals = data?.goals;
        invariant(name, "Invalid innovation tier name");
        invariant(benefits, "Invalid innovation tier benefits");
        invariant(requisites, "Invalid innovation tier requisites");
        invariant(goals, "Invalid innovation tier goals");
        response = await addInnovationTier({
          name,
          benefits,
          requisites,
          goals,
        });
        return json(response, { status: 201 });

      case "DELETE":
        id = data?.id as string;
        await removeInnovationTier({ name: id });
        return json({ error: "" }, { status: 200 });

      case "UPDATE":
        id = data?.id;
        name = data?.name;
        benefits = data?.benefits;
        requisites = data?.requisites;
        goals = data?.goals;
        invariant(name, "Invalid innovation tier name");
        invariant(benefits, "Invalid innovation tier benefits");
        invariant(requisites, "Invalid innovation tier requisites");
        invariant(goals, "Invalid innovation tier goals");
        await updateInnovationTier({ id, name, benefits, requisites, goals });
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

function InnovationTiersGrid(){
  const fetcher = useFetcher();
  const { innovationTiers } = useLoaderData() as LoaderData;
  const createButtonText = "Create New Innovation Tier";
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const [editMode, setEditMode] = useState<boolean>(false);
  const [rows, setRows] = useState<InnovationTierRecord[]>(() =>
    innovationTiers.map((item: InnovationTierItem) => ({
      id: item.name,
      name: item.name,
      benefits: item.benefits,
      requisites: item.requisites,
      goals: item.goals,
    }))
  );
  const [selectedRowID, setSelectedRowID] = useState("");
  const [projects, setProjects] = useState<ProjectRecord[]>([]);
  const [items, { push }] = useFieldArray("ids", {
    formId: "delete-tier-form",
  });
  const [openCreateModal, setOpenCreateModal] = useState<boolean>(false);

  const navigation = useNavigation();

  useEffect(() => {
    const isActionRedirect = validateNavigationRedirect(navigation)
    if (isActionRedirect) {
      setOpenCreateModal(false);
    }
  }, [navigation]);

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
      innovationTiers.map((item: InnovationTierItem) => ({
        id: item.name,
        name: item.name,
        benefits: item.benefits,
        requisites: item.requisites,
        goals: item.goals,
      }))
    );
  }, [innovationTiers]);

  // Delete Innovation Tier
  const deleteConfirmationHandler = async () => {
    setOpenDeleteModal(false);
    try {
      const body = {
        name: selectedRowID,
        id: selectedRowID,
        action: "DELETE",
        benefits: " ",
        requisites: " ",
        goals: " ",
      };
      await fetcher.submit(body, { method: "delete" });
    } catch (error: any) {
      console.error(error);
    }
  };

  const handleDeleteClick = async (id: string) => {
    const body = {
      innovationTier: id,
    };
    await fetcher.submit(body, { method: "get" });
    setSelectedRowID(() => id);
    setOpenDeleteModal(() => true);
  };

  const handleEditClick = (id: string) => {
    setSelectedRowID(id);
    setEditMode(true);
    setOpenCreateModal(true)
  }

  const handleCreateClick = () => {
    setOpenCreateModal(true);
    setEditMode(false)
  }

  const handleSubmit = async ({
    projectsIds,
  }: {
    projectsIds: (string | number)[];
  }) => {
    projectsIds.forEach((id) => push(id));

    await deleteConfirmationHandler();
  };
  interface HeadTiersData {
    id: keyof InnovationTierRecord;
    label: string;
    numeric: boolean;
  }

  const headCells: HeadTiersData[] = [
    {
      id: "name",
      numeric: false,
      label: "Name",
    },
    {
      id: "benefits",
      numeric: false,
      label: "Benefits",
    },
    {
      id: "requisites",
      numeric: false,
      label: "Requisites",
    },
    {
      id: "goals",
      numeric: false,
      label: "Goals",
    },
    {
      id: "id",
      numeric: false,
      label: "Actions",
    },
    
  ];

  const isMergeAction = projects.length > 0;

  return (
    <div>
      <Container sx={{ marginBottom: 2 }}>
        <Card>
        <CardHeader
        title="Innovation Tiers"
        action={
          <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => handleCreateClick()}
          data-testid="testInnovationCreate"
        >
          {createButtonText}
        </Button>
        }
        />
          <CardContent>
            <TableContainer>
              <Table>
                <TableHead>
                  {
                    headCells.map((cell) => (
                      <TableCell key={cell.id} align="center" padding="normal">
                        <TableSortLabel>
                          {cell.label}
                        </TableSortLabel>
                      </TableCell>
                    ))
                  }
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
                            {row.benefits}
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            align="center"
                          >
                            {row.requisites}
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            align="center"
                          >
                            {row.goals}
                          </TableCell>
                          <TableCell
                            component="th"
                            id={labelId}
                            scope="row"
                            padding="normal"
                            align="center"
                            width="20%"
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
                              data-testid="testInnovationDelete"
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


      {/* Confirmation for deletion */}
      <ModalBox
        open={openDeleteModal}
        handleClose={() => setOpenDeleteModal(false)}
        close={() => setOpenDeleteModal(false)}
      >
        <h2>Choose the Innovation Tier to merge {selectedRowID} with </h2>
        <p>This action will delete {selectedRowID}</p>
        <p>This action cannot be undone.</p>
        <br />
        <p>
          {projects.length < 1
            ? "There are no projects"
            : projects.length === 1
            ? "There is 1 project"
            : `There are ${projects.length} projects`}{" "}
          with this category
        </p>
        <br />
        <div>
          <ValidatedForm
            validator={validatorForm}
            onSubmit={async () => {
              await handleSubmit({
                projectsIds: projects.map((project) => project.id),
              });
            }}
            method="post"
            action="../merge/tiers"
            id="delete-tier-form"
          >
          <input type="hidden" name="id" value={selectedRowID} />

            {isMergeAction && (
              <InputSelect
                valuesList={innovationTiers.filter(
                  (tier) => tier.name !== selectedRowID
                )}
                name="name"
                label="Innovation Tier to merge with"
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
                color="warning"
                disabled={false}
                data-testid="deleteTierModal"
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


      {/* create status Modal */}
      <ModalBox open={openCreateModal} close={() => setOpenCreateModal(false)}>
        <h2 data-testid="testCreateTierModal">
          {
            editMode ? "Edit Innovation Tier" + selectedRowID : "Add a new innovation tier"
          }
        </h2>
        <ValidatedForm action='./' method="post" subaction={ editMode ? "UPDATE" : "ADD" } validator={validatorFront}
           defaultValues={  editMode ?  rows.find( row => row.name == selectedRowID) : undefined}
        >
          <input type="hidden" name="id" value={selectedRowID} />

          <Stack spacing={2}>
          <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />

          <LabeledTextField fullWidth name="benefits" label="Benefits" placeholder="Benefits" />

          <LabeledTextField fullWidth name="requisites" label="Requisites" placeholder="Requisites" />

          <LabeledTextField fullWidth name="goals" label="Goals" placeholder="Goals" />
          
          
          <div>
            <Button variant="contained" onClick={() => setOpenCreateModal(false)}>
              Cancel
            </Button>
              &nbsp;
            <Button type="submit" variant="contained" color="warning">
              { editMode ? "Update" : "Create"}
            </Button>
          </div>
          </Stack>
        </ValidatedForm>
      </ModalBox>
    </div>
  );
};
export default InnovationTiersGrid;

export function ErrorBoundary() {
  const error = useRouteError() as Error
  console.error(error);

  if (isRouteErrorResponse(error) && error.status === 404) {
    return <div>Innovation Tier not found</div>;
  }

  return <div>An unexpected error occurred: {error.message}</div>;
}
