import { Prisma } from "@prisma/client"
import { prisma } from "~/db.server"

export type { Profiles } from "@prisma/client"

export async function searchProfiles(searchTerm: string) {
  const select = Prisma.sql`
    SELECT id as "profileId", "firstName" || ' ' || "lastName" || ' <' || "email" || '>' as name
    FROM "Profiles"
  `
  const orderBy = Prisma.sql`
    ORDER BY "firstName", "lastName"
    LIMIT 50;
  `
  let result
  if (searchTerm && searchTerm !== "") {
    const prefixSearch = `%${searchTerm}%`
    const where = Prisma.sql`WHERE "searchCol" like lower(unaccent(${prefixSearch}))`
    result = await prisma.$queryRaw`
      ${select}
      ${where}
      ${orderBy}
    `
  } else {
    result = await prisma.$queryRaw`
      ${select}
      ${orderBy}
    `
  }
  return result
}
