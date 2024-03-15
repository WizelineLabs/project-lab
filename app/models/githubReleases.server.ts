import { db } from "../db.server";

export async function saveRelease(
  id: string,
  body: string,
  name: string,
  tagName: string,
  author: string,
  prerealease: boolean,
  created_at: string,
  projectId: string,
  link: string
) {
  await db
    .selectFrom("GitHubReleases")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  return await db.insertInto("GitHubReleases").values({
    id,
    body,
    name,
    tagName,
    author,
    prerealease,
    created_at: new Date(created_at),
    projectId,
    link,
  });
}

export async function getReleasesListData(projectId: string) {
  return await db
    .selectFrom("GitHubReleases")
    .selectAll()
    .where("projectId", "=", projectId)
    .orderBy("created_at", "desc")
    .execute();
}
