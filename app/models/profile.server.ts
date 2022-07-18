import type { User, Profiles } from "@prisma/client";

import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getProfileByUserId(id: User["id"]) {
  const result = await prisma.$queryRaw<Profiles[]>`
    SELECT * FROM "Profiles" p
    INNER JOIN "User" u ON u.email = p.email
    WHERE u.id = ${id}
  `;

  if (result.length != 1 || !result[0]) return null;
  else return result[0];
}