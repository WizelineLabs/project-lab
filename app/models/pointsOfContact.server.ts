import { v4 as uuid } from "uuid";
import { db } from "~/db.server";

export async function addPointOfContact(input: {
  fullName: string;
  university: string;
}) {
  const existingUniversity = await db
    .selectFrom("Universities")
    .select("id")
    .where("name", "=", input.university)
    .executeTakeFirst();

  let universityId: string;

  if (!existingUniversity) {
    const createdUniversity = await db
      .insertInto("Universities")
      .values({
        id: uuid(),
        name: input.university,
        updatedAt: new Date(),
        createdAt: new Date(),
      })
      .returning("id")
      .executeTakeFirst();
    universityId = createdUniversity!.id;
  } else {
    universityId = existingUniversity.id;
  }

  const university = await db
    .insertInto("UniversityPointsOfContact")
    .values({
      id: uuid(),
      fullName: input.fullName,
      universityId,
      updatedAt: new Date(),
    })
    .returning(["id", "fullName", "universityId"])
    .executeTakeFirst();
  return { university };
}

export async function getPointsOfContact() {
  return db
    .selectFrom("UniversityPointsOfContact as upoc")
    .innerJoin("Universities as u", "u.id", "upoc.universityId")
    .select(["upoc.id", "upoc.fullName", "upoc.active", "u.name as university"])
    .orderBy("upoc.fullName", "asc")
    .execute();
}

export async function updatePointOfContact({
  id,
  fullName,
  university,
  active,
}: {
  id: string;
  fullName: string;
  university: string;
  active: boolean;
}) {
  const uni = await db
    .selectFrom("Universities")
    .select("id")
    .where("name", "=", university)
    .executeTakeFirst();

  await db
    .updateTable("UniversityPointsOfContact")
    .set({ fullName, active, universityId: uni?.id })
    .where("id", "=", id)
    .execute();
}

export async function searchPointOfContact(q: string, universityId: string) {
  return db
    .selectFrom("UniversityPointsOfContact as upoc")
    .innerJoin("Universities as u", "u.id", "upoc.universityId")
    .select(["upoc.fullName", "u.name", "u.id", "upoc.id"])
    .where("u.id", "=", universityId)
    .where("u.name", "ilike", `%${q}%`)
    .orderBy("upoc.fullName", "asc")
    .execute();
}
