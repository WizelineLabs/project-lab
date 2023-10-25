/* eslint-disable no-console */
import { Octokit } from "@octokit/core";
import { env } from "process";
const octokit = new Octokit({ USERNAME: env.AUTH0_CLIENT_SECRET });

export const getUserInfo = async (email: string) => {
  try {
    return await octokit.request(`GET /search/users?q=${email}`);
  } catch (e) {
    console.log("unable to get the github user");
    return {
      data: null,
    };
  }
};

export const getUserByUsername = async (username: string) => {
  try {
    return await octokit.request(`GET /users/${username}`);
  } catch (e) {
    console.log("unable to get the github user");
    return {
      data: null,
    };
  }
};

export const getUserRepos = async (username: string) => {
  try {
    return await octokit.request(`GET /users/${username}/repos`);
  } catch (e) {
    console.log(`Unable to get user repos`);
    return {
      data: null,
    };
  }
};
