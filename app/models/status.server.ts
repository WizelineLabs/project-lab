import { db } from "~/db.server";

export type { ProjectStatus } from "@prisma/client";

interface updateProjectStatusType {
  id: string;
  name: string;
  stage?: string | null;
}

export async function getProjectStatuses() {
  return await db
    .selectFrom("ProjectStatus")
    .selectAll()
    .orderBy("name", "asc")
    .execute();
}

export async function addProjectStatus(data: { name: string; stage?: string }) {
  return await db
    .insertInto("ProjectStatus")
    .values(data)
    .returningAll()
    .execute();
}

export async function removeProjectStatus({ name }: { name: string }) {
  await db.deleteFrom("ProjectStatus").where("name", "=", name).execute();
}

export async function updateProjectStatus({
  id,
  name,
  stage,
}: updateProjectStatusType) {
  const data = {
    name,
    stage,
  };

  if (stage === "none") {
    data.stage = null;
  }
  await db
    .updateTable("ProjectStatus")
    .set(data)
    .where("name", "=", id)
    .execute();
}
