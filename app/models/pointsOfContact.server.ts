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

export async function getPointOfContactById(id: string) {
  const pointofContact = await db.universityPointsOfContact.findUnique({
    where: {
      id: id,
    }
  });
  return !!pointofContact;
}
async function validatePointOfContact(id: string) {
  const pointofContact = await db.universityPointsOfContact.findFirst({
    where: { id },
  });
  if (!pointofContact) {
    const error: ResponseError = new Error("Point of Contact not found in DB");
    error.code = "NOT_FOUND";
    throw error;
  }
  return;
}

export async function updatePointOfContact({ id, fullName, university}: { id: string; fullName: string; university: string}) {
  await validatePointOfContact(id);
  const uni = await db.universities.findUnique({
    where: {
      name : university
    }
  });
  await db.universityPointsOfContact.update({ where: { id }, data: { fullName: fullName,
  universityId: uni?.id } });
}