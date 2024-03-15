import { db } from "~/db.server";

export type { InnovationTiers } from "@prisma/client";

interface newInnovationTier {
  name: string;
  benefits: string;
  requisites: string;
  goals: string;
}

export async function getInnovationTiers() {
  return await db
    .selectFrom("InnovationTiers")
    .select(["name", "benefits", "requisites", "goals"])
    .orderBy("name", "asc")
    .execute();
}

export async function addInnovationTier(input: newInnovationTier) {
  return db
    .insertInto("InnovationTiers")
    .values(input)
    .returningAll()
    .execute();
}

export async function removeInnovationTier({ name }: { name: string }) {
  await db.deleteFrom("InnovationTiers").where("name", "=", name).execute();
}

export async function updateInnovationTier(data: newInnovationTier) {
  await db
    .updateTable("InnovationTiers")
    .set(data)
    .where("name", "=", data.name)
    .execute();
}
