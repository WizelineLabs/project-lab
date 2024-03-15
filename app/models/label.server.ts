import { v4 as uuid } from "uuid";
import { db } from "~/db.server";

export type { Labels } from "@prisma/client";

export async function getLabels() {
  return db.selectFrom("Labels").selectAll().orderBy("name", "asc").execute();
}

export async function searchLabels(searchTerm: string) {
  return db
    .selectFrom("Labels")
    .selectAll()
    .where("name", "ilike", `%${searchTerm}%`)
    .orderBy("name", "asc")
    .execute();
}

export async function addLabel(name: string) {
  return db
    .insertInto("Labels")
    .values({ id: uuid(), name })
    .returningAll()
    .execute();
}

export async function removeLabel({ id }: { id: string }) {
  await db.deleteFrom("Labels").where("id", "=", id).execute();
}

export async function updateLabel({ id, name }: { id: string; name: string }) {
  await db.updateTable("Labels").set({ name }).where("id", "=", id).execute();
}
