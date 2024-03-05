import { jsonArrayFrom } from "kysely/helpers/postgres";
import { v4 as uuid } from "uuid";
import { db } from "~/db.server";

export async function getComments(projectId: string) {
  return db
    .selectFrom("Comments as c")
    .leftJoin("Profiles as p", "c.authorId", "p.id")
    .selectAll("c")
    .select(({ eb }) => [
      "p.preferredName as authorPreferredName",
      "p.lastName as authorLastName",
      "p.avatarUrl as authorAvatarUrl",
      jsonArrayFrom(
        eb
          .selectFrom("Comments as c2")
          .leftJoin("Profiles as p2", "c2.authorId", "p2.id")
          .selectAll("c2")
          .select([
            "p2.preferredName as authorPreferredName",
            "p2.lastName as authorLastName",
            "p2.avatarUrl as authorAvatarUrl",
          ])
          .whereRef("c2.parentId", "=", "c.id")
      ).as("children"),
    ])
    .where("c.projectId", "=", projectId)
    .execute();
}

export async function getComment(id: string) {
  return await db
    .selectFrom("Comments as c")
    .selectAll("c")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function createComment(
  projectId: string,
  authorId: string,
  body: string,
  parentId?: string | null
) {
  return await db
    .insertInto("Comments")
    .values({
      id: uuid(),
      projectId,
      authorId,
      body,
      parentId,
    })
    .returning(["id", "body", "authorId", "createdAt", "updatedAt"])
    .executeTakeFirstOrThrow();
}

export async function updateComment(id: string, body: string) {
  return await db
    .updateTable("Comments")
    .set({ body })
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function deleteComment(id: string) {
  return await db.deleteFrom("Comments").where("id", "=", id).execute();
}
