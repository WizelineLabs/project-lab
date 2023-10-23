import { prisma } from "~/db.server";
export type { Disciplines } from "@prisma/client";

interface profileId {
  id: string;
}

export async function searchDisciplines(searchTerm: string) {
  const disciplines = await prisma.disciplines.findMany({
    where: { name: { contains: searchTerm, mode: "insensitive" } },
    orderBy: {
      name: "asc",
    },
  });
  return disciplines;
}

export async function searchDisciplineByName(disciplineName: string) {
  const disciplines = await prisma.disciplines.findUnique({
    where: { name: disciplineName },
  });
  return disciplines;
}

export async function getProfileIdByDiscipline(disciplineId: string) {
  const roleVar = `%${disciplineId}%`;
  const idByDiscipline = await prisma.$queryRaw<profileId[]>`
    WITH LatestProjectMembers AS (
      SELECT
        "profileId",
        "role",
        "updatedAt",
        ROW_NUMBER() OVER (PARTITION BY "profileId" ORDER BY "updatedAt" DESC) AS rn
      FROM "ProjectMembersVersions"
    )
    SELECT DISTINCT ON ("pmv"."profileId") "pmv"."profileId" as id
    FROM LatestProjectMembers as pmv
    WHERE 
        pmv."role" LIKE ${roleVar} AND pmv.rn = 1
    ORDER BY "pmv"."profileId";
  `;

  return idByDiscipline.map((item) => item.id.toString());
}
