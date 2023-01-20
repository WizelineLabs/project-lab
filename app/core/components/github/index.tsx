import {
  Card,
  CardContent,
  CardHeader,
  Container,
  Grid,
  Paper,
} from "@mui/material";
import GitHubCommits from "./GithubCommits";

export const GitHubSection = ({ repoName }: { repoName: string }) => {
  return (
    <>
      <Container sx={{ marginBottom: 2 }}>
        <Grid container justifyContent="space-between">
          <Grid item xs={12}>
            <Paper>
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
    </>
  );
};

export default GitHubSection;
