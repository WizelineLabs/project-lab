import { Octokit } from "@octokit/core";
import { env } from "process";

const octokit = new Octokit({ USERNAME: env.AUTH0_CLIENT_SECRET });

export const getCommits = async () => {
  const owner = "wizeline",
    repo = "remix-project-lab",
    perPage = 10;
  return octokit.request(`GET /repos/{owner}/{repo}/commits`, {
    owner,
    repo,
    per_page: perPage,
  });
};
