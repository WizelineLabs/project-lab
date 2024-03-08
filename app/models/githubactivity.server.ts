import { db } from "../db.server";
import { sql } from "kysely";

interface gitHubActivityChartType {
  count: number;
  typeEvent: string;
}

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
  return await sql<gitHubActivityChartType[]>`SELECT Count(*)::int, "typeEvent"
  FROM "GitHubActivity"
  WHERE date_part('week', "created_at")=${week} AND "projectId" = ${projectId}
  GROUP BY "typeEvent"`.execute(db);
};
