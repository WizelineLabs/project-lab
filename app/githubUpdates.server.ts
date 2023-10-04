import type { PrismaClient, Prisma } from "@prisma/client";
import { prisma } from "~/db.server";
import { getActivity } from "./routes/api/github/get-proyectActivity";

async function searchLastUpdateProjects() {

    const lastUpdate =  await prisma.$queryRaw<any[]>`SELECT DISTINCT p."id", p."name", p."projectBoard", MAX(ga.created_at) from "Projects" p
        RIGHT JOIN "GitHubActivity" ga on p."id" = ga."projectId"
        WHERE p."isArchived" = FALSE
        GROUP BY p."id", p."name", p."projectBoard"
        `;


}

export async function getGitHubActivity() {
    const projectsBoards = await prisma.$queryRaw<any[]>`
        SELECT p."id", p."projectBoard" from "Projects" p
        WHERE p."isArchived" = FALSE and p."projectBoard" is not null
    `;

    projectsBoards.forEach(async project => {
        await getActivity(project.projectBoard, project.id);
    })

}
