import { prisma as db } from "~/db.server";

interface ResponseError extends Error {
  code?: string;
}
export async function addUniversity(input: { name: string }) {
  const university = await db.universities.create({ data: input });
  return { university };
}

export async function getUniversities() {
  return await db.universities.findMany({
    select: { id: true, name: true, active: true },
    orderBy: {
      name: "asc",
    },
  });
}

export async function geActivetUniversities() {
  return await db.universities.findMany({
    select: { id: true, name: true, active: true },
    orderBy: {
      name: "asc",
    },
    where: {
      active: true,
    }
  });
}


async function validateUniversity(id: string) {
  const innovationTier = await db.universities.findFirst({
    where: { id },
  });
  if (!innovationTier) {
    const error: ResponseError = new Error("University not found in DB");
    error.code = "NOT_FOUND";
    throw error;
  }
  return;
}

export async function updateUniversity({ id, name, active}: { id: string; name: string, active: boolean }) {
  await validateUniversity(id);
  await db.universities.update({ where: { id }, data: { name, active } });
}

export async function searchUniversities(searchTerm: string) {
  const universities = await db.universities.findMany({
    where: { name: { contains: searchTerm, mode: "insensitive" }},
    select: {
      name: true,
      id: true
    },
    orderBy: {
      name: "asc",
    },
  });
  return universities;
}
