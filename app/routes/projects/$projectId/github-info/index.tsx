import { Button, Container, Grid, Paper, Typography } from "@mui/material";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import Header from "~/core/layouts/Header";
import { getProject } from "~/models/project.server";
import GoBack from "~/core/components/GoBack";
import { GitHub, Refresh } from "@mui/icons-material";
import type { Repos } from "@prisma/client";
import GitHubActivity from "~/core/components/GitHub/GitHubActivity";
import { getGitActivityData } from "~/models/githubactivity.server";
// import { getActivity } from "~/routes/api/github/get-proyectActivity";



export const loader = async ({ request, params }: LoaderArgs) => {
    invariant(params.projectId, "projectId not found");
    const projectId = params.projectId;
    const project = await getProject({ id: params.projectId });
    if (!project) {
      throw new Response("Not Found", { status: 404 });
    }
    // await getActivity('remix-project-lab',projectId);
    const activityData = await getGitActivityData(projectId);
  
    return typedjson({
      project,
      projectId,
      activityData
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

    const {
        project,projectId, activityData
      } = useTypedLoaderData<typeof loader>();
    
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

                </Grid>
            </Paper>
        </Container>
    </>
}