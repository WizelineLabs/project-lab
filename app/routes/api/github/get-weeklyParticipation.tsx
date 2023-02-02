import { Octokit } from "@octokit/core";
import { env } from "process";
const octokit = new Octokit({ USERNAME: env.AUTH0_CLIENT_SECRET });

export const getWeeklyParticipation = async (repo: string) => {
  const owner = "wizeline";
  return await octokit.request(
    `GET /repos/{owner}/{repo}/stats/participation`,
    {
      owner,
      repo,
    }
  );
};
