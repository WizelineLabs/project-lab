    import { Alert, Button, Container, Grid, InputLabel, MenuItem, Paper, Select, Stack, Typography } from "@mui/material";
    import type { LoaderFunction } from "@remix-run/server-runtime";
    import { json } from "@remix-run/node";
    import invariant from "tiny-invariant";
    import Header from "~/core/layouts/Header";
    import { getProject } from "~/models/project.server";
    import GoBack from "~/core/components/GoBack";
    import {  GitHub, Refresh } from "@mui/icons-material";
    import type { Repos } from "@prisma/client";
    import GitHubActivity from "~/core/components/GitHub/GitHubActivity";
    import { getActivityStadistic, getGitActivityData } from "~/models/githubactivity.server";
    import { Bar } from "react-chartjs-2";
    import {
        Chart as ChartJS,
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend,
    } from 'chart.js';
import { ValidatedForm } from "remix-validated-form";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { useLoaderData, useSubmit } from "@remix-run/react";
    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    
    type LoaderData = {
        project: Awaited<ReturnType<typeof getProject>>,
        projectId: string,
        activityData: Awaited<ReturnType<typeof getGitActivityData>>,
        activityChartData: Awaited<ReturnType<typeof getActivityStadistic>>,
        weekParams: number
      };

    interface gitHubActivityChartType {
        count: number,
        typeEvent: string,
    }

    let currentdate:any = new Date();
        let oneJan:any = new Date(currentdate.getFullYear(),0,1);
        let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
        let week = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);

    export const validator = withZod(
        zfd.formData({
          body: z.string().min(1),
          parentId: z.string().optional().nullable(),
          id: z.string().optional(),
        })
      );

    export const loader: LoaderFunction = async ({ request, params }) => {
        invariant(params.projectId, "projectId not found");
        const url = new URL(request.url);
        let weekParams = 0;
        weekParams = parseInt(url.searchParams.get("week") as string);
        const projectId = params.projectId;
        const project = await getProject({ id: params.projectId });
        if (!project) {
        throw new Response("Not Found", { status: 404 });
        }
        const activityData = await getGitActivityData(projectId);
        const activityChartData:gitHubActivityChartType[] = await getActivityStadistic(weekParams ? weekParams : week);

        return json<LoaderData>({
            project,
            projectId,
            activityData,
            activityChartData,
            weekParams
        });
    };


    const cleanURL = (repoInfo: Repos[]):string => {
        
        if (repoInfo[0] && repoInfo[0].url !== '') {
            return repoInfo[0].url.substring(repoInfo[0].url.lastIndexOf("/") + 1);
        } else {
            return "";
        }
    }

    export default function GitHubInfo() {
        const submit = useSubmit();
        let currentdate:any = new Date();
        let oneJan:any = new Date(currentdate.getFullYear(),0,1);
        let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));        

        const itemsSelect = [];
                
        const { project, projectId, activityData, activityChartData, weekParams } = useLoaderData();
        
        let week = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);
        let selectedWeek = weekParams ? weekParams : week;
        
        for (let index = 1; index <= week; index++) {
            itemsSelect.push(<MenuItem key={index} selected={index == selectedWeek} value={index}>{index}</MenuItem>)
        }

        const dataChart = {
                labels: activityChartData.map( (activity: { typeEvent: any; }) => activity.typeEvent),
                datasets:  [ {
                    data: activityChartData.map( (activity: { count: any; }) => Number(activity.count)),
                    backgroundColor: "#3B72A4",
                    borderColor: "#3B72A4",
                }],
                
        };        

        const options = {
            responsive: true,
            color: "#A7C7DC",
            plugins: {
            title: {
                display: true,
                text: `Events per Week`,
                color: "#A7C7DC"
                },
                legend: {
                    display: false,
                   
                },
            },
            scales: {
                x: {
                    title: {
                        display: false
                    },
                    grid: {
                        display:false
                    },
                    ticks: {
                        color: "#A7C7DC"
                    }
                },
                y: {
                    title: {
                        display: false
                    },
                    ticks: {
                        color: "#4BA4E1",
                    },
                    grid: {
                        color: '#6C7176'
                    }
                }
            }
           
        };

        const handleSubmit = async (event: any) => {

            const body = {
                week: event.target.value,
            };
            
            submit(body);

        }

       
        
        
        return <> 
            <Header title="" />
            <Container sx={{ marginBottom: 2 }}>
                <Paper
                    sx={{
                        paddingLeft: 2,
                        paddingRight: 2,
                        paddingBottom: 2,
                    }}
                >   
                <GoBack title="Back to project" href={`/projects/${projectId}`} />
                    <Grid container justifyContent="space-between">
                        <Grid item>
                        <h1 style={{ marginBottom: 0 }}><GitHub /> {project.name}</h1>
                        <Typography color="text.secondary">
                            Last commit: 
                        </Typography>
                        </Grid>
                        
                    </Grid>
                </Paper>
            </Container>

            <Container>
                <Paper sx={{ padding: 2, width: 1 }} >
                    <Grid sx={{margin: 2}}>
                        <Grid container justifyContent="space-between" >
                            <Typography color="text.primary">
                                    Project Participation
                            </Typography>
                            <Button variant="contained" endIcon={<Refresh />} />
                        </Grid>
                        <Grid container sx={{ padding: 2, width: 1 }} >
                            {  project.repoUrls && <GitHubActivity projectId={projectId} repoName={cleanURL(project.repoUrls)} activityData = {activityData} /> }
                        </Grid>
                    </Grid>
                </Paper>
            </Container>

            <Container>
                <Paper sx={{ padding: 2, width: 1 }} >   
                    <Grid container sx={{ margin: 2}} justifyContent="space-between" >
                        <Typography color="text.primary">
                            Stadistics
                        </Typography>
                    </Grid>
                    <Grid container sx={{ padding: 2, width: 1 }} >
                    <ValidatedForm
                        action="./"
                        method="post"
                        validator={validator}
                    >
                        <InputLabel id="week-select-label">
                             Select a Week:
                        </InputLabel>
                        <Select
                            id="actions-select"
                            label="Select a Week:"
                            style={{ width: "100%" }}
                            value={selectedWeek}
                            onChange={ (event) => handleSubmit(event) }
                        >
                        {
                            itemsSelect.map((item) => item)     
                        }
                        </Select>
                    </ValidatedForm>
                    {
                        ( activityChartData.length > 0 &&     
                            <Bar
                                options={options}
                                data={dataChart}
                            />
                            
                        )
                    }
                    </Grid>
                    {

                        (
                         activityChartData.length == 0 && 
                         <Stack >
                             <Alert severity="warning">There is no data to show.</Alert>
                         </Stack>    
                        )
                    }
                </Paper>
            </Container>
        </>
    }