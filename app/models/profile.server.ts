import type { User, Profiles } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getProfileByUserId(id: User["id"]) {
  const result = await prisma.$queryRaw<Profiles[]>`
    SELECT p.*, u.name, u.role, u.id as userId FROM "Profiles" p
    INNER JOIN "User" u ON u.email = p.email
    WHERE u.id = ${id}
  `;

  if (result.length != 1 || !result[0]) return null;
  else return result[0];
}

export async function searchProfiles(searchTerm: string) {
  const select = Prisma.sql`
    SELECT id, "firstName" || ' ' || "lastName" || ' <' || "email" || '>' as name
    FROM "Profiles"
  `;
  const orderBy = Prisma.sql`
    ORDER BY "firstName", "lastName"
    LIMIT 50;
  `;
  let result;
  if (searchTerm && searchTerm !== "") {
    const prefixSearch = `%${searchTerm}%`;
    const where = Prisma.sql`WHERE "searchCol" like lower(unaccent(${prefixSearch}))`;
    result = await prisma.$queryRaw`
      ${select}
      ${where}
      ${orderBy}
    `;
  } else {
    result = await prisma.$queryRaw`
      ${select}
      ${orderBy}
    `;
  }
  return result;
}
