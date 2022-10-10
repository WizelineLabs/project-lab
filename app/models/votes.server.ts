import { prisma } from "~/db.server";

export async function upvoteProject(id: string, profileId: string) {
  const votes = await prisma.vote.create({
    data: {
      projectId: id,
      profileId: profileId,
    },
  });
  return votes;
}

export async function unvoteProject(id: string, profileId: string) {
  const votes = await prisma.vote.deleteMany({
    where: { AND: [{ projectId: id }, { profileId: profileId }] },
  });

  return votes;
}

export async function checkUserVote(id: string, profileId: string) {
  const haveIVoted = await prisma.vote.count({
    where: { AND: [{ projectId: id }, { profileId: profileId }] },
  });

  return haveIVoted;
}
