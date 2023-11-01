import { Octokit } from "@octokit/core";
import { env } from "process";
import { cleanUrlRepo } from "~/utils";
const octokit = new Octokit({ auth: env.GITHUB_KEY });


export const getActivity = async (repo: string) => {
    const owner = "wizeline";
    const repoUrlClean = cleanUrlRepo(repo);
    try{
        const repoReleases = await octokit.request(`GET /repos/${owner}/${repoUrlClean}/releases`, {
            owner,
            repoUrlClean,
          });

          // eslint-disable-next-line no-console
          console.log(repoReleases);

    }catch(e){

    }
}