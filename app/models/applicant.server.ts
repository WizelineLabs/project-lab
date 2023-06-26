import { prisma as db } from "~/db.server";

export async function searchApplicants() {
  return await db.applicant.findMany({});
}

export async function getApplicantById(id: any) {
  return await db.applicant.findUnique({
    where: { id: parseInt(id) },
    include: {
      project: {
        select: {
          name: true,
          ownerId: true,
          projectMembers: {
            select: {
              profileId: true,
            },
          },
        },
      },
      mentor: {
        select: { preferredName: true },
      },
    },
  });
}

export async function editApplicant(data:any, id:number) {
    return await db.applicant.update({ data , where: { id }});
}
