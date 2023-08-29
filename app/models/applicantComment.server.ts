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

  export async function getComment(id: string) {
    return await db.internsComments.findUniqueOrThrow({
      where: { id },
    });
  }

  export async function getCommentsApplicant(applicantId: number) {
    return await db.internsComments.findMany({
      where: { applicantId, parentId: null },
      orderBy: { updatedAt: "desc" },
      include: { author: true, children: { include: { author: true } } },
    });
  }

  export async function updateComment(id: string, body: string) {
    return await db.internsComments.update({
      where: { id },
      data: {
        body,
      },
    });
  }


export async function deleteComment(id: string) {
  return await db.internsComments.delete({
    where: { id },
  });
}