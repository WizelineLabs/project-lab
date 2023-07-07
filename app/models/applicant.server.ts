import { prisma as db } from "~/db.server";

export async function searchApplicants() {
  return await db.applicant.findMany({
    where : {
      startDate: {
        gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 3 /** months **/ * 1000).toISOString()
      }
    }
  });
}

export async function getApplicantById(id: any) {
  return await db.applicant.findUnique({
    where: { 
      id: parseInt(id)
    },
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
        select: { preferredName: true, lastName: true },
      },
    },
  });
}

export async function editApplicant(data:any, id:number) {
  // eslint-disable-next-line no-console
  console.log('test edit');
  return await db.applicant.update({ data , where: { id }});
}