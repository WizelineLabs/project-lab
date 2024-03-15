/* eslint-disable no-console */
import { cleanUrlRepo } from "../utils";
import { saveActivity } from "./githubactivity.server";
import { Octokit } from "@octokit/core";
import { env } from "process";

const octokit = new Octokit({ auth: env.GITHUB_KEY });

export const getActivity = async (repo: string, projectId: string) => {
  const owner = "wizeline";
  const repoUrlClean = cleanUrlRepo(repo);
  if (repo != "") {
    try {
      const repoActivity = await octokit.request(
        `GET /repos/${owner}/${repoUrlClean}/events`,
        {
          owner,
          repoUrlClean,
        }
      );
      console.log("limit ", repoActivity.headers["x-ratelimit-limit"]);
      console.log(
        "ratelimit-remaining ",
        repoActivity.headers["x-ratelimit-remaining"]
      );

      if (repoActivity.status != 404) {
        // eslint-disable-next-line no-console
        console.log(
          repoUrlClean,
          repoUrlClean,
          repoActivity.status,
          repoActivity.headers["x-ratelimit-limit"],
          repoActivity.headers["x-ratelimit-remaining"],
          repoActivity.data.length
        );
        repoActivity.data?.forEach(
          (activity: {
            id: string;
            type: string;
            created_at: string;
            actor: { display_login: string; avatar_url: string };
          }) => {
            saveActivity(
              activity.id,
              activity.type?.replace(/([a-z0-9])([A-Z])/g, "$1 $2") as string, //this is for separe the string with camel case into pieces
              activity.created_at as string,
              activity.actor.display_login as string,
              activity.actor.avatar_url as string,
              projectId
            );
            return;
          }
        );
      }
    } catch (e) {
      console.error("the repo url doesnt exit", repoUrlClean);
    }
  } else {
    return;
  }
};
