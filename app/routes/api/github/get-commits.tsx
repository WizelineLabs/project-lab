import { Octokit } from "@octokit/core";
import { env } from "process";
const octokit = new Octokit({ USERNAME: env.AUTH0_CLIENT_SECRET });

export const getCommits = async (repoUrl: string) => {
  const owner = "wizeline",
    repo = repoUrl;
  const reponseCommits = await octokit.request(
    `GET /repos/{owner}/{repo}/commits`,
    {
      owner,
      repo,
    }
  );
  return reponseCommits.data.map((item: any) => {
    return {
      url: item.url,
      sha: item.sha,
      node_id: item.node_id,
      html_url: item.html_url,
      comments_url: item.comments_url,
      commit: {
        url: item.commit.url,
        author: {
          name: item.commit.author != null ? item.commit.author.name! : "",
          email: item.commit.author != null ? item.commit.author.email! : "",
          date: item.commit.author != null ? item.commit.author.date! : "",
        },

        message: item.commit.message,
      },
      author: {
        avatar_url: item.author != null ? item.author.avatar_url : "",
        url: item.author != null ? item.author.url : "",
        html_url: item.author != null ? item.author.html_url : "",
      },
    };
  });
};
