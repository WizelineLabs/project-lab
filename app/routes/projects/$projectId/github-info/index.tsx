    import { Button, Container, FormControl, Grid, InputLabel, MenuItem, Paper, Select, SelectChangeEvent, Typography } from "@mui/material";
    import type { LoaderArgs } from "@remix-run/server-runtime";
    import { typedjson, useTypedLoaderData } from "remix-typedjson";
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

    // import { getActivity } from "~/routes/api/github/get-proyectActivity";

    ChartJS.register(
        CategoryScale,
        LinearScale,
        BarElement,
        Title,
        Tooltip,
        Legend
    );
    

    interface gitHubActivityChartType {
        count: number,
        typeEvent: string,
    }

    export const loader = async ({ request, params }: LoaderArgs) => {
        invariant(params.projectId, "projectId not found");
        const projectId = params.projectId;
        const project = await getProject({ id: params.projectId });
        if (!project) {
        throw new Response("Not Found", { status: 404 });
        }
        // await getActivity('remix-project-lab',projectId);
        const activityData = await getGitActivityData(projectId);
        const activityChartData:gitHubActivityChartType[] = await getActivityStadistic();
        return typedjson({
        project,
        projectId,
        activityData,
        activityChartData
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
        let currentdate:any = new Date();
        let oneJan:any = new Date(currentdate.getFullYear(),0,1);
        let numberOfDays = Math.floor((currentdate - oneJan) / (24 * 60 * 60 * 1000));
        let week = Math.ceil(( currentdate.getDay() + 1 + numberOfDays) / 7);

        const itemsSelect = [];

        for (let index = 1; index <= week; index++) {
            itemsSelect.push(<MenuItem value={index}>{index}</MenuItem>)
        }        

        const {
            project,projectId, activityData, activityChartData
        } = useTypedLoaderData<typeof loader>();

        const dataChart = {
                labels: activityChartData.map( activity => activity.typeEvent),
                datasets:  [ {
                    data: activityChartData.map( activity => Number(activity.count)),
                    backgroundColor: "#3B72A4",
                    borderColor: "#3B72A4",
                }],
                
        };

        const options = {
            responsive: true,
            color: "#fff",
            plugins: {
            title: {
                display: true,
                text: 'Events per Week, Week #',
                color: "#fff"
                },
                legend: {
                    display: false,
                   
                },
            },
            scales: {
                xAxes: {
                    color: "white",
                    display: false,
                },
                }
           
        };

        const changeChartData = (event: SelectChangeEvent<unknown>) =>{
            console.log('change select', event.target.value);
            
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
                        <FormControl fullWidth size="medium">

                            <InputLabel id="demo-simple-select-label">
                                Select a Week:
                            </InputLabel>
                            <Select
                            id="actions-select"
                            label="Select a Week:"
                            onChange={(e) => changeChartData(e)}
                            >
                                {
                                    itemsSelect.map(item => {
                                        return item
                                    })
                                   
                                }
                            </Select>
                        </FormControl>
                        <Bar
                            options={options}
                            data={dataChart}
                        />
                    </Grid>
                </Paper>
            </Container>
        </>
    }