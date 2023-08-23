import { prisma as db } from "~/db.server";


export async function createComment(
    applicantId: number,
    authorId: string,
    body: string,
    parentId?: string | null
  ) {
    return await db.internsComments.create({
      data: {
        applicantId,
        authorId,
        body,
        parentId,
      },
    });
  }

  export async function getCommentsApplicant(applicantId: number) {
    return await db.internsComments.findMany({
      where: { applicantId, parentId: null },
      orderBy: { updatedAt: "desc" },
      include: { author: true, children: { include: { author: true } } },
    });
  }