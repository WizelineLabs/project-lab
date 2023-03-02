import type { User } from "@prisma/client";
import { prisma } from "~/db.server";

export type { User } from "@prisma/client";

export async function getUserById(id: User["id"]) {
  return prisma.user.findUnique({ where: { id } });
}

export async function getUserByEmail(email: User["email"]) {
  return prisma.user.findUnique({ where: { email } });
}

export async function findOrCreate(create: {
  email: User["email"];
  name: User["name"];
}) {
  return prisma.user.upsert({
    where: { email: create.email },
    create,
    update: create,
  });
}

export async function deleteUserByEmail(email: User["email"]) {
  return prisma.user.delete({ where: { email } });
}

export async function getAdminUsers() {
  const users = await prisma.user.findMany({
    where: { role: "ADMIN" },
    orderBy: { name: "asc" },
    select: { id: true, name: true, email: true, role: true },
  });

  return users;
}

export async function addAdminUser({ email }: { email: string }) {
  const profileUser = await prisma.profiles.findFirst({ where: { email } });
  if (!profileUser) {
    return {error: "User not found in WOS"}
  }
  try{
    const user = await prisma.user.upsert({
      where: { email },
      create: {
        email,
        role: "ADMIN",
      },
      update: { email, role: "ADMIN" },
    });
    return {user, error: ""};
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}

export async function removeAdminUser({ id }: { id: string }) {
  try{
    await prisma.user.update({ where: { id }, data: { role: "USER" } })
    return { error: ""};
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}
