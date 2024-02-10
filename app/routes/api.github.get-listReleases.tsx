import { saveRelease } from "../models/githubReleases.server";
import { cleanUrlRepo } from "../utils";
import { Octokit } from "@octokit/core";
import { PrismaClient } from "@prisma/client";
import { env } from "process";

const octokit = new Octokit({ auth: env.GITHUB_KEY });

const db = new PrismaClient();

export const getReleasesList = async (repo: string, projectId: string) => {
  const owner = "wizeline";
  const repoUrlClean = cleanUrlRepo(repo);

  if (repo != "") {
    try {
      const repoReleases = await octokit.request(
        `GET /repos/${owner}/${repoUrlClean}/releases`,
        {
          owner,
          repoUrlClean,
        }
      );

      if (repoReleases.status != 404) {
        // eslint-disable-next-line no-console
        console.log(
          repoUrlClean,
          repoUrlClean,
          repoReleases.status,
          repoReleases.headers["x-ratelimit-limit"],
          repoReleases.headers["x-ratelimit-remaining"],
          repoReleases.data.length
        );
        repoReleases.data?.forEach(
          (data: {
            id: string;
            body: string;
            name: string;
            tag_name: string;
            author: { login: string };
            prerelease: boolean;
            published_at: string;
            html_url: string;
          }) => {
            saveRelease(
              data.id.toString(),
              data.body,
              data.name,
              data.tag_name,
              data.author?.login,
              data.prerelease,
              data.published_at,
              projectId,
              data.html_url,
              db
            );
            return;
          }
        );
      }
    } catch (e) {}
  }
};
