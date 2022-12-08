import { prisma } from "~/db.server";

export type { Skills } from "@prisma/client";

export async function searchSkills(searchTerm: string) {
  const skills = await prisma.skills.findMany({
    where: { name: { contains: searchTerm, mode: "insensitive" } },
    orderBy: {
      name: "asc",
    },
    take: 100,
  });
  return skills;
}
