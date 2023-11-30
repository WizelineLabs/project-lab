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
    select: { id: true, name: true },
    orderBy: {
      name: "asc",
    },
  });
}

export async function getUniversityById(id: string) {
  const university = await db.universities.findUnique({
    where: {
      id: id,
    },
    include:{
      pointsOfContact: true
    }
  });
  return !!university;
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

export async function updateUniversity({ id, name }: { id: string; name: string }) {
  await validateUniversity(id);
  await db.universities.update({ where: { id }, data: { name } });
}

export async function searchUniversities(searchTerm: string) {
  const universities = await db.universities.findMany({
    where: { name: { contains: searchTerm, mode: "insensitive" }},
    orderBy: {
      name: "asc",
    },
  });
  return universities;
}
