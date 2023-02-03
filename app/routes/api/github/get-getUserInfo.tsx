import { Octokit } from "@octokit/core";
import { env } from "process";
const octokit = new Octokit({ USERNAME: env.AUTH0_CLIENT_SECRET });

export const getUserInfo = async (email: string) => {
  return await octokit.request(`GET /search/users?q=${email}`);
};
