import { prisma as db } from "~/db.server";

interface ResponseError extends Error {
  code?: string;
}
type newPointOfContact = {
  fullName: string;
  university: {
    connectOrCreate: {
      where: {
        id?: string
        name?: string
      };
      create: {
        id?: string
        name: string
        active?: boolean;
      }
    }
  };
  active?: boolean;
  id?: string;
};

export async function addPointOfContact(input: newPointOfContact) {
  const university = await db.universityPointsOfContact.create({ data: input });
  return { university };
}

export async function getPointsOfContact() {
  return await db.universityPointsOfContact.findMany({
    select: { id: true, fullName: true, university: 
      {
        select: {
          name: true
        }
      }
    },
    orderBy: {
      fullName: "asc",
    },
  });
}

export async function getUniversityById(id: string) {
  const university = await db.universityPointsOfContact.findUnique({
    where: {
      id: id,
    }
  });
  return !!university;
}
async function validatePointOfContact(id: string) {
  const innovationTier = await db.universityPointsOfContact.findFirst({
    where: { id },
  });
  if (!innovationTier) {
    const error: ResponseError = new Error("Point of Contact not found in DB");
    error.code = "NOT_FOUND";
    throw error;
  }
  return;
}

export async function updatePointOfContact({ id, fullName}: { id: string; fullName: string; }) {
  await validatePointOfContact(id);
  await db.universityPointsOfContact.update({ where: { id }, data: { fullName } });
}