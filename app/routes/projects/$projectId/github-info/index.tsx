import { CircularProgress, Container, Grid, Paper, Stack, Typography } from "@mui/material";
import type { LoaderArgs } from "@remix-run/server-runtime";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import invariant from "tiny-invariant";
import Header from "~/core/layouts/Header";
import { getProject } from "~/models/project.server";
import GitHub from '@mui/icons-material/GitHub';
import GoBack from "~/core/components/GoBack";



export const loader = async ({ request, params }: LoaderArgs) => {
    invariant(params.projectId, "projectId not found");
    const projectId = params.projectId;
  
    const project = await getProject({ id: params.projectId });
    if (!project) {
      throw new Response("Not Found", { status: 404 });
    }
  
    return typedjson({
      project,
      projectId
    });
  };
  

export default function GitHubInfo() {

    const {
        project,projectId
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
                <Grid container justifyContent="center" >
                    <Grid item alignItems="center">
                        <p>We are working in this section</p>
                            <Stack alignItems="center" justifyContent="center">
                                <CircularProgress />
                            </Stack>
                    </Grid>
                </Grid>

            </Paper>
        </Container>
    </>
}