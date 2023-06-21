import { prisma as db } from "~/db.server";

export async function searchApplicants() {
  return await db.applicant.findMany({});
}

export async function getApplicantById(id: any) {
  return await db.applicant.findUnique({
    where: { id: parseInt(id) },
  });
}
