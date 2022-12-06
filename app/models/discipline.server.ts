import { prisma } from "~/db.server"

export type { Disciplines } from "@prisma/client"

export async function searchDisciplines(searchTerm: string) {
  const disciplines = await prisma.disciplines.findMany({
    where: { name: { contains: searchTerm, mode: "insensitive" } },
    orderBy: {
      name: "asc",
    },
  })
  return disciplines
}
