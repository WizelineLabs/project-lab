import type { User, Profiles, PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";

import { prisma } from "../db.server";

interface UserProfile extends Profiles {
  role: string;
  name: string;
  userId: string;
}

export async function getProfileByUserId(id: User["id"]) {
  const result = await prisma.$queryRaw<UserProfile[]>`
    SELECT p.*, u.name, u.role, u.id as userId FROM "Profiles" p
    INNER JOIN "User" u ON u.email = p.email
    WHERE u.id = ${id}
  `;

  if (result.length != 1 || !result[0]) return null;
  else return result[0];
}

export async function getProfileByEmail(email: Profiles["email"]) {
  return prisma.profiles.findUnique({
    where: { email },
  });
}

export async function createProfile(data: Prisma.ProfilesCreateInput) {
  return prisma.profiles.create({ data });
}

export async function consolidateProfilesByEmail(
  data: Prisma.ProfilesCreateInput[],
  db: PrismaClient
) {
  const profileMails = data.map((profile) => {
    return profile.email;
  });
  console.info(`Starting upsert profiles to DB`);

  const profilesUpsert = data.map((profile) => {
    return db.profiles.upsert({
      where: { email: profile.email },
      update: {
        ...profile,
      },
      create: {
        ...profile,
      },
    });
  });

  console.info(`Starting delete profiles from DB`);
  await db.$transaction([
    db.$queryRaw`UPDATE "Profiles" SET deleted=TRUE WHERE email NOT IN (${profileMails.join(
      ","
    )})`,
    ...profilesUpsert,
  ]);
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
