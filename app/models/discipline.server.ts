import { db } from "~/db.server";

export async function searchDisciplines(searchTerm: string) {
  return await db
    .selectFrom("Disciplines")
    .selectAll()
    .where("name", "ilike", `%${searchTerm}%`)
    .orderBy("name", "asc")
    .execute();
}

export async function searchDisciplineByName(disciplineName: string) {
  return await db
    .selectFrom("Disciplines")
    .selectAll()
    .where("name", "=", disciplineName)
    .executeTakeFirst();
}
