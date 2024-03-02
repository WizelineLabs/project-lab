import { jsonArrayFrom } from "kysely/helpers/postgres";
import { v4 as uuid } from "uuid";
import { db } from "~/db.server";

export async function createComment(
  applicantId: number,
  authorId: string,
  body: string,
  parentId?: string | null
) {
  return await db
    .insertInto("internsComments")
    .values({
      id: uuid(),
      applicantId,
      authorId,
      body,
      parentId,
    })
    .returning(["id", "body", "authorId", "createdAt", "updatedAt"])
    .executeTakeFirstOrThrow();
}

export async function getComment(id: string) {
  return await db
    .selectFrom("internsComments as ic")
    .selectAll("ic")
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function getCommentsApplicant(applicantId: number) {
  return await db
    .selectFrom("internsComments as ic")
    .leftJoin("Profiles as p", "ic.authorId", "p.id")
    .selectAll("ic")
    .select(({ eb }) => [
      "p.preferredName as authorPreferredName",
      "p.lastName as authorLastName",
      "avatarUrl as authorAvatarUrl",
      jsonArrayFrom(
        eb
          .selectFrom("internsComments as ic2")
          .leftJoin("Profiles as p2", "ic2.authorId", "p2.id")
          .selectAll("ic2")
          .select([
            "p.preferredName as authorPreferredName",
            "p.lastName as authorLastName",
            "avatarUrl as authorAvatarUrl",
          ])
          .whereRef("ic2.parentId", "=", "ic.id")
      ).as("children"),
    ])
    .where("applicantId", "=", applicantId)
    .execute();
}

export async function updateComment(id: string, body: string) {
  return await db
    .updateTable("internsComments")
    .set({ body })
    .where("id", "=", id)
    .executeTakeFirstOrThrow();
}

export async function deleteComment(id: string) {
  return await db.deleteFrom("internsComments").where("id", "=", id).execute();
}
