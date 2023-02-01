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

export async function updateProfile(
  data: Prisma.ProfilesUpdateInput,
  id: string
) {
  return prisma.profiles.update({ where: { id }, data: data });
}

export async function consolidateProfilesByEmail(
  data: Prisma.ProfilesCreateInput[],
  db: PrismaClient
) {
  // don't do anything if we have no data (avoid Terminating users)
  if (data.length == 0) {
    return;
  }
  const profileMails = data.map((profile) => {
    return profile.email;
  });
  // eslint-disable-next-line no-console
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
  // eslint-disable-next-line no-console
  console.info(`Terminate users not found on data lake from DB`);
  await db.$transaction([
    db.$queryRaw`UPDATE "Profiles" SET "employeeStatus"='Terminated' WHERE email NOT IN (${Prisma.join(
      profileMails
    )})`,
    ...profilesUpsert,
  ]);
}

export async function searchProfiles(searchTerm: string) {
  const select = Prisma.sql`
    SELECT id, "preferredName" || ' ' || "lastName" || ' <' || "email" || '>' as name
    FROM "Profiles"
  `;
  const orderBy = Prisma.sql`
    ORDER BY "preferredName", "lastName"
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
