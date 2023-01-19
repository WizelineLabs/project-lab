import { Octokit } from "@octokit/core";
import { env } from "process";
const octokit = new Octokit({ USERNAME: env.AUTH0_CLIENT_SECRET });

export const getCommits = async (repoUrl: string) => {
  const owner = "wizeline",
    repo = repoUrl,
    perPage = 10;
  return await octokit.request(`GET /repos/{owner}/{repo}/commits`, {
    owner,
    repo,
    per_page: perPage,
  });
};
