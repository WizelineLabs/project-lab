import { prisma } from "~/db.server";
export type { Projects } from "@prisma/client";
export type { Vote } from "@prisma/client";

export async function upvoteProject(id: string, userId: string) {
  const votes = await prisma.vote.create({
    data: {
      projectId: id,
      profileId: userId,
    },
  });
  console.log(`CREATE RESULT:`)
  console.log(votes)
  return votes;
}

export async function unvoteProject(id: string, userId: string) {
  const votes = await prisma.vote.deleteMany({
    where: { AND: [{ projectId: id }, { profileId: userId }] },
  });

  return votes;
}
