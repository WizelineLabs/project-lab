import { prisma } from "~/db.server";

export type { Disciplines } from "@prisma/client";

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
