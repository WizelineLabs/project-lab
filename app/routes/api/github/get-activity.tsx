import { Octokit } from "@octokit/core";
import { env } from "process";
const octokit = new Octokit({ USERNAME: env.AUTH0_CLIENT_SECRET });

export const getActivity = async (repo: string) => {
  const owner = "wizeline";
  return await octokit.request(`GET /repos/{owner}/{repo}/events`, {
    owner,
    repo,
  });
};
