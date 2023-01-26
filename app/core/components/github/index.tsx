import { Container, Grid, Paper } from "@mui/material";
import GitHubActivity from "./GitHubActivity";
import GitHubCommits from "./GithubCommits";

export const GitHubSection = ({ repoName }: { repoName: string }) => {
  return (
    <>
      <Container sx={{ marginBottom: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12}>
            <Paper
              sx={{
                paddingLeft: 2,
                paddingRight: 2,
                paddingBottom: 2,
              }}
            >
              <h1 style={{ marginBottom: 0 }}>Github Info</h1>
            </Paper>
          </Grid>
        </Grid>
      </Container>
      <Container sx={{ marginBottom: 2 }}>
        <Grid container>
          <GitHubCommits repoName={repoName} />
        </Grid>
      </Container>
      <Container>
        <Grid container spacing={2} alignItems="stretch">
          <Grid item xs={12} md={8}>
            {/* <GitHubActivity repoName={repoName} /> */}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default GitHubSection;
