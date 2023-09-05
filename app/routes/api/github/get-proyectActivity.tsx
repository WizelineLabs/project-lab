import { Octokit } from "@octokit/core";
import { env } from "process";
const octokit = new Octokit({ auth: env.GITHUB_KEY });

export const getActivity = async (repo: string) => {
  const owner = "wizeline";
  return await octokit.request(`GET /repos/{owner}/{repo}/events`, {
    owner,
    repo,
  });
};