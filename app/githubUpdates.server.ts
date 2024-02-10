import { getReleasesList } from "./routes/api.github.get-listReleases";
import { getActivity } from "./routes/api.github.get-proyectActivity";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

// export async function searchLastUpdateProjects() {

//     const lastUpdate =  await prisma.$queryRaw<any[]>`SELECT DISTINCT p."id", p."name", p."projectBoard", MAX(ga.created_at) from "Projects" p
//         RIGHT JOIN "GitHubActivity" ga on p."id" = ga."projectId"
//         WHERE p."isArchived" = FALSE
//         GROUP BY p."id", p."name", p."projectBoard"
//         `;

// } I will use it later jeje

export async function getGitHubActivity() {
  const projectsBoards = await db.$queryRaw<
    { id: string; name: string; url: string }[]
  >`
        SELECT p."id", p."name", r.url from "Projects" p
        RIGHT JOIN "Repos" r on p."id" = r."projectId"
        WHERE p."isArchived" = FALSE and r."url" is not null
    `;

  projectsBoards.map(
    async (board) =>
      await getActivity(board.url, board.id).catch((e) => {
        throw e;
      })
  );
  projectsBoards.map(
    async (board) =>
      await getReleasesList(board.url, board.id).catch((e) => {
        throw e;
      })
  );
}
