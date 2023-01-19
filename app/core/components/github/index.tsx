import { Card, CardContent, CardHeader, Container } from "@mui/material";
import GitHubCommits from "./GithubCommits";

export const GitHubSection = ({ repoName }: { repoName: string }) => {
  return (
    <>
      <Container sx={{ marginBottom: 2 }}>
        <GitHubCommits repoName={repoName} />
      </Container>
    </>
  );
};

export default GitHubSection;
