import { Box, Button, Container, Divider, Grid, IconButton, List, ListItemButton, ListItemIcon, ListItemText, Paper, Stack, Tab, Tabs, styled } from "@mui/material";
import { Link, Outlet, useTransition } from "@remix-run/react";
import GoBack from "~/core/components/GoBack";
import Header from "~/core/layouts/Header";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import { isProjectTeamMember, getProject } from "~/models/project.server";
import { adminRoleName, quartersOptions, statusObjectivesOptions } from "app/constants";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import { EditPanelsStyles } from "~/routes/manager/manager.styles";
import type { SyntheticEvent } from "react";
import { Fragment } from "react";
import { useEffect, useState } from "react";
import type { LoaderArgs } from "@remix-run/server-runtime";
import TabPanel from "~/core/components/TabPanel";
import ModalBox from "~/core/components/ModalBox";
import { ValidatedForm } from "remix-validated-form";
import LabeledTextField from "~/core/components/LabeledTextField";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import InputSelect from "~/core/components/InputSelect";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/DeleteOutlined";
import { getAllObjectives } from "~/models/objectives.server";

type Objective = {
    id: string;
    name: string;
    input: string;
    quarter: string;
    result: string;
    status: string;
    projectId: string
}

export const loader = async ({ request, params }: LoaderArgs) => {
    invariant(params.projectId, "projectId could not be found");
    const projectId = params.projectId;
    const project = await getProject({ id: projectId });
    if (!project) {
      throw new Response("Not Found", { status: 404 });
    }
    const user = await requireUser(request);
    const profile = await requireProfile(request);
    const isTeamMember = isProjectTeamMember(profile.id, project);
    const isAdmin = user.role == adminRoleName;
    const profileId = profile.id;
    const objectives = await getAllObjectives(projectId);
  
    return typedjson({
      isAdmin,
      isTeamMember,
      profile,
      project,
      profileId,
      projectId,
      objectives
    });
  };

  const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(2),
    textAlign: 'center',
    color: theme.palette.text.secondary,
  }));
  
  export const validator = withZod(
    z.object({
      id: z.string().optional(),
      editmode: z.string().optional(),
      name: z
        .string()
        .min(1, { message: "Name is required" }),
      input: z
        .string()
        .min(1, { message: "Name is required" }),
      result: z
        .string()
        .min(1, { message: "Name is required" }),
      quarter: z
        .object({name: z.string().min(1, { message: "Quarter is required"})}),
      status: z
        .object({name: z.string().min(1, { message: "Status is required"})}),
    })
  );

  export const deleteValidator = withZod(
    z.object(
        {
            id: z.string(),
            projectId: z.string()
        }
    )
  );


export default function RoadMapProject() {

    const [tabIndex, setTabIndex] = useState(2);
    const [openCreateModal, setOpenCreateModal] = useState(false);
    const [openDeleteModal, setOpenDeleteModal] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [selectedRow, setSelectedRow] = useState<Objective>();

    const transition = useTransition();

    useEffect(() => {
        if (transition.type == "actionReload" || transition.type == "actionSubmission" || transition.type == "actionRedirect") {
            setOpenCreateModal(false);
            setOpenDeleteModal(false);
        }
    }, [transition]);

    const handleTabChange = (event: SyntheticEvent, tabNumber: number) =>
    setTabIndex(tabNumber);
    const { project, projectId, objectives } =
    useTypedLoaderData<typeof loader>();
    let objectivesQ1:Objective[] = [];
    let objectivesQ2:Objective[] = [];
    let objectivesQ3:Objective[] = [];
    let objectivesQ4:Objective[] = [];

    if(objectives.length > 0) {
        objectivesQ1 = objectives.filter(objective => objective.quarter === 'Q1');
        objectivesQ2 = objectives.filter(objective => objective.quarter === 'Q2');
        objectivesQ3 = objectives.filter(objective => objective.quarter === 'Q3');
        objectivesQ4 = objectives.filter(objective => objective.quarter === 'Q4');
    }

    const handleEditObjective = (idObjective:string) => {
        const objective:Objective | undefined = objectives.find( obj => obj.id === idObjective) || undefined;
        setSelectedRow(objective)
        setEditMode(true);
        setOpenCreateModal(true);
    }

    const handleDeleteObjective = (idObjective:string) => {
        setOpenCreateModal(false);
        const objective:Objective | undefined = objectives.find( obj => obj.id === idObjective) || undefined;
        setSelectedRow(objective)
        setOpenDeleteModal(true);
    }

    return (
        <>
            <Header title={"Edit " + project.name} />
            <Outlet></Outlet>

            <Container>
                <Paper elevation={0} sx={{ paddingLeft: 2, paddingRight: 2 }}>
                <h1 className="form__center-text">Edit {project.name}</h1>
                </Paper>
            </Container>

            <Container>
                <Paper
                elevation={0}
                sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}
                >
                <GoBack title="Back to project" href={`/projects/${projectId}`} />

                <EditPanelsStyles>
                    <Box>
                    <Tabs
                        value={tabIndex}
                        onChange={handleTabChange}
                        aria-label="Edit project"
                    >
                        <Tab
                        component={Link}
                        label="Project Details"
                        to={`/projects/${projectId}/edit`}
                        />
                        <Tab
                        component={Link}
                        label="Contributor's Path"
                        to={`/projects/${projectId}/editContributorsPath`}
                        />
                         <Tab
                            component={Link}
                            label="Project Roadmap"
                            to={`/projects/${projectId}/roadmap`}
                            />
                    </Tabs>
                    </Box>

                    <TabPanel value={tabIndex} index={2}>
                        <Grid
                            container
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={2}
                            mb={4}
                        >
                            <Grid item>
                                <Button onClick={() => {
                                    setOpenCreateModal(true);
                                    setEditMode(false);
                                }} variant="contained">Add Objective</Button>
                            </Grid>
                        </Grid>


                        <Grid container spacing={{ xs: 2, md: 4 }} columns={{ xs: 4, sm: 8, md: 12 }}>
                            <Grid item xs={4} sm={4} md={3} key={1}>
                            <List>
                                <Item key="q1">Q1</Item>
                                    {
                                        objectivesQ1 && objectivesQ1.map( objective => {
                                            return(
                                                <Fragment key={objective.id}>
                                                    <ListItemButton >   
                                                        <ListItemText primary={objective.name} />
                                                        <ListItemIcon >
                                                            <IconButton onClick={() => handleEditObjective(objective.id)}>
                                                                <EditIcon color="primary" />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                        <ListItemIcon>
                                                            <IconButton onClick={() => handleDeleteObjective(objective.id)}>
                                                                <DeleteIcon color="warning" />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                    </ListItemButton> 
                                                    <Divider />
                                                </Fragment>
                                            )
                                        }
                                        )
                                    }
                                    
                                </List>
                            </Grid>
                            <Grid item xs={4} sm={4} md={3} key={2}>
                            <List>
                                <Item key="q2">Q2</Item>

                                {
                                    objectivesQ2 && objectivesQ2.map( objective => {
                                        return(
                                                <Fragment key={objective.id}>
                                                    <ListItemButton key={objective.id}>   
                                                        <ListItemText primary={objective.name} />
                                                        <ListItemIcon >
                                                            <IconButton onClick={() => handleEditObjective(objective.id)}>
                                                                <EditIcon color="primary" />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                        <ListItemIcon>
                                                            <IconButton onClick={() => handleDeleteObjective(objective.id)}>
                                                                <DeleteIcon color="warning" />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                    </ListItemButton> 
                                                    <Divider />
                                                </Fragment>
                                        )
                                    })
                                }
                            </List>

                               
                            </Grid>
                            <Grid item xs={4} sm={4} md={3} key={3}>
                            <List>
                                <Item key="q3">Q3</Item>

                                {
                                    objectivesQ3 && objectivesQ3.map( objective => {
                                        return(
                                            <Fragment key={objective.id}>
                                                <ListItemButton >   
                                                    <ListItemText primary={objective.name} />
                                                    <ListItemIcon >
                                                        <IconButton onClick={() => handleEditObjective(objective.id)}>
                                                            <EditIcon color="primary" />
                                                        </IconButton>
                                                    </ListItemIcon>
                                                    <ListItemIcon>
                                                        <IconButton onClick={() => handleDeleteObjective(objective.id)}>
                                                            <DeleteIcon color="warning" />
                                                        </IconButton>
                                                    </ListItemIcon>
                                                </ListItemButton> 
                                                 <Divider />
                                            </Fragment>
                                        )
                                    })
                                }
                            </List>
                               
                            </Grid>
                            <Grid item xs={4} sm={4} md={3} key={4}>
                                <List>
                                    <Item key="q4">Q4</Item>
                                    {
                                    objectivesQ4 && objectivesQ4.map( objective => {
                                        return(
                                                <Fragment key={objective.id}>
                                                    <ListItemButton>    
                                                        <ListItemText primary={objective.name} />
                                                        <ListItemIcon >
                                                            <IconButton onClick={() => handleEditObjective(objective.id)}>
                                                                <EditIcon color="primary" />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                        <ListItemIcon>
                                                            <IconButton onClick={() => handleDeleteObjective(objective.id)}>
                                                                <DeleteIcon color="warning" />
                                                            </IconButton>
                                                        </ListItemIcon>
                                                    </ListItemButton> 
                                                    <Divider />
                                                </Fragment>
                                        )
                                    })
                                }

                                </List>
                            </Grid>
                        </Grid>

                    </TabPanel>
                </EditPanelsStyles>
                </Paper>
            </Container>

            <ModalBox
                open={openCreateModal}
                handleClose={() => setOpenCreateModal(false)}
                close={() => {
                    setSelectedRow(undefined);
                    setOpenCreateModal(false);
                }}
            >
                <h2 data-testid="createNewLabel">
                    {editMode ?  "Edit Objective" : "Create objective"}
                </h2>
                <ValidatedForm action='./createRoadMap' method="post" validator={validator} id="create-form"
                   defaultValues={ editMode ? {
                        id: selectedRow?.id,
                        name: selectedRow?.name,
                        input: selectedRow?.input,
                        result: selectedRow?.result,
                        quarter: selectedRow ? { name: selectedRow?.quarter } : { name: ""},
                        status: selectedRow ? { name: selectedRow?.status } : { name: ""},
                    } : {} }
                >
                    <Stack spacing={2}>
                        <input type="hidden" name="id" value={selectedRow?.id} />
                        <input type="hidden" name="editmode" value={editMode ? "edit" : "create"} />
                        <input type="hidden" name="projectId" value={projectId} />
                        <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />
                        <LabeledTextField fullWidth name="input" label="Input" placeholder="Input (What do you need to start)" />
                        <LabeledTextField fullWidth name="result" label="Result" placeholder="Result" />
                        <InputSelect
                            valuesList={quartersOptions}
                            name="quarter"
                            label="Select a quarter"
                            disabled={false}
                        />
                        <InputSelect
                            valuesList={statusObjectivesOptions}
                            name="status"
                            label="Select a status"
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
                <br />
            </ModalBox>
            
            <ModalBox
                open={openDeleteModal}
                handleClose={() => setOpenDeleteModal(false)}
                close={() => { 
                    setSelectedRow(undefined);
                    setOpenDeleteModal(false)
                }}
            >
                <h2 data-testid="createNewLabel">
                    Delete Objective
                </h2>

                <ValidatedForm validator={deleteValidator} action='./deleteObjective' method="post">
                    <input type="hidden" name="id" value={selectedRow?.id} />
                    <input type="hidden" name="projectId" value={projectId} />
                    <p>This action cannot be undone.</p>
                    <div>
                            <Button variant="contained" onClick={() => setOpenCreateModal(false)}>
                                Cancel
                            </Button>
                            &nbsp;
                            <Button type="submit" variant="contained" color="warning">
                                Delete
                            </Button>
                    </div>
                </ValidatedForm>
            </ModalBox>
           

        </>     
    )
}