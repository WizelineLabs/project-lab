import { db } from "../db.server";
import { getReleasesList } from "./github.get-listReleases";
import { getActivity } from "./github.get-proyectActivity";

// export async function searchLastUpdateProjects() {

//     const lastUpdate =  await prisma.$queryRaw<any[]>`SELECT DISTINCT p."id", p."name", p."projectBoard", MAX(ga.created_at) from "Projects" p
//         RIGHT JOIN "GitHubActivity" ga on p."id" = ga."projectId"
//         WHERE p."isArchived" = FALSE
//         GROUP BY p."id", p."name", p."projectBoard"
//         `;

// } I will use it later jeje

export async function getGitHubActivity() {
  const projectsBoards = await db
    .selectFrom("Projects as p")
    .innerJoin("Repos as r", "p.id", "r.projectId")
    .select(["p.id", "p.name", "r.url"])
    .where("p.isArchived", "=", false)
    .where("r.url", "is not", null)
    .execute();

  projectsBoards.map(
    async (board) =>
      await getActivity(board.url, board.id).catch((e) => {
        console.log("error", board.url, e.status);
      })
  );
  projectsBoards.map(
    async (board) =>
      await getReleasesList(board.url, board.id).catch((e) => {
        console.log("error", board.url, e.status);
      })
  );
}
