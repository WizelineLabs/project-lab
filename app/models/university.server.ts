import { v4 as uuid } from "uuid";
import { db } from "~/db.server";

export async function addUniversity(input: { name: string }) {
  return await db
    .insertInto("Universities")
    .values({
      id: uuid(),
      name: input.name,
      active: true,
      updatedAt: new Date(),
      createdAt: new Date(),
    })
    .returning(["id", "name"])
    .executeTakeFirst();
}

export async function getUniversities() {
  return await db
    .selectFrom("Universities")
    .select(["id", "name", "active"])
    .orderBy("name", "asc")
    .execute();
}

export async function getActiveUniversities() {
  return await db
    .selectFrom("Universities")
    .select(["id", "name", "active"])
    .where("active", "=", true)
    .orderBy("name", "asc")
    .execute();
}

export async function updateUniversity({
  id,
  name,
  active,
}: {
  id: string;
  name: string;
  active: boolean;
}) {
  await db
    .updateTable("Universities")
    .set({ name, active })
    .where("id", "=", id)
    .execute();
}

export async function searchUniversities(searchTerm: string) {
  const universities = await db
    .selectFrom("Universities")
    .select(["id", "name"])
    .where("name", "ilike", `%${searchTerm}%`)
    .orderBy("name", "asc")
    .execute();
  return universities;
}
