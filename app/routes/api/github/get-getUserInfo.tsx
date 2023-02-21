/* eslint-disable no-console */
import { Octokit } from "@octokit/core";
import { env } from "process";
const octokit = new Octokit({ USERNAME: env.AUTH0_CLIENT_SECRET });

export const getUserInfo = async (email: string) => {
  try{
    return await octokit.request(`GET /search/users?q=${email}`);
  }
  catch (e){
    console.log('unable to get the guthub user');
    return {
      data: null
    };
  }
};
