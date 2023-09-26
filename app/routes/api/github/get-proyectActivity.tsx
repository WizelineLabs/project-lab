import { Octokit } from "@octokit/core";
import { env } from "process";
import { saveACtivity } from "~/models/githubactivity.server";
const octokit = new Octokit({ auth: env.GITHUB_KEY });

export const getActivity = async (repo: string, projectId: string) => {
  const owner = "wizeline";
  if(repo != ''){
    const repoActivity = await octokit.request(`GET /repos/{owner}/{repo}/events`, {
      owner,
      repo,
    });

    repoActivity.data.forEach( activity => {
      saveACtivity(activity.id , 
        activity.type?.replace(/([a-z0-9])([A-Z])/g, '$1 $2') as string, //this is for separe the string with camel case into pieces 
        activity.created_at as string, activity.actor.display_login as string, 
        activity.actor.avatar_url as string, projectId );
    return;
    });
  }else{
    return;
  }
};
