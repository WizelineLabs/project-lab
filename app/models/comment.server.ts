import { prisma as db } from "~/db.server";

export async function getComments(projectId: string) {
  return await db.comments.findMany({
    where: { projectId, parentId: null },
    orderBy: { updatedAt: "desc" },
    include: { author: true, children: { include: { author: true } } },
  });
}

export async function getComment(id: string) {
  return await db.comments.findUniqueOrThrow({
    where: { id },
  });
}

export async function createComment(
  projectId: string,
  authorId: string,
  body: string,
  parentId?: string | null
) {
  return await db.comments.create({
    data: {
      projectId,
      authorId,
      body,
      parentId,
    },
  });
}

export async function updateComment(id: string, body: string) {
  return await db.comments.update({
    where: { id },
    data: {
      body,
    },
  });
}

export async function deleteComment(id: string) {
  return await db.comments.delete({
    where: { id },
  });
}
