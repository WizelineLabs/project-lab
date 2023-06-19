import { prisma as db } from "~/db.server";

export async function searchApplicants() {
  return await db.applicant.findMany({});
}
