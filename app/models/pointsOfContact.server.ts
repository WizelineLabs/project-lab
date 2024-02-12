import { prisma as db } from "~/db.server";

interface ResponseError extends Error {
  code?: string;
}

export async function addPointOfContact(input: {
  fullName: string;
  university: {
    connectOrCreate: { create: { name: string }; where: { name: string } };
  };
}) {
  const university = await db.universityPointsOfContact.create({ data: input });
  return { university };
}

export async function getPointsOfContact() {
  return await db.universityPointsOfContact.findMany({
    select: {
      id: true,
      fullName: true,
      active: true,
      university: {
        select: {
          name: true,
        },
      },
    },
    orderBy: {
      fullName: "asc",
    },
  });
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

export async function updatePointOfContact({
  id,
  fullName,
  university,
  active,
}: {
  id: string;
  fullName: string;
  university: string;
  active: boolean;
}) {
  await validatePointOfContact(id);
  const uni = await db.universities.findUnique({
    where: {
      name: university,
    },
  });
  await db.universityPointsOfContact.update({
    where: { id },
    data: { fullName, active, universityId: uni?.id },
  });
}

export async function searchPointOfContact(q: string, universityId: string) {
  const pointsOfContact = await db.universityPointsOfContact.findMany({
    where: {
      AND: [
        {
          university: {
            id: universityId,
          },
        },
        {
          university: {
            name: {
              contains: q,
              mode: "insensitive",
            },
          },
        },
      ],
    },
    select: {
      fullName: true,
      university: {
        select: {
          name: true,
          id: true,
        },
      },
      id: true,
    },
    orderBy: {
      fullName: "asc",
    },
  });
  return pointsOfContact;
}
