import { db } from "../db.server";
import { sql } from "kysely";

export async function saveActivity(
  id: string,
  typeEvent: string,
  created_at: string,
  author: string,
  avatar_url: string,
  projectId: string
) {
  await db
    .selectFrom("GitHubActivity")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();

  return await db.insertInto("GitHubActivity").values({
    id,
    typeEvent,
    created_at: new Date(created_at),
    author,
    avatar_url,
    projectId,
  });
}

export async function getGitActivityData(projectId: string) {
  return await db
    .selectFrom("GitHubActivity")
    .selectAll()
    .where("projectId", "=", projectId)
    .orderBy("created_at", "desc")
    .execute();
}

export const getActivityStadistic = async (week: number, projectId: string) => {
  return await db
    .selectFrom("GitHubActivity")
    .select(({ fn }) => [fn.count<number>("id").as("count"), "typeEvent"])
    .where("projectId", "=", projectId)
    .where(sql`date_part('week', "created_at")`, "=", week)
    .groupBy("typeEvent")
    .execute();
};
