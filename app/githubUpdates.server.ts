import { getActivity } from "./routes/api/github/get-proyectActivity";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// export async function searchLastUpdateProjects() {

//     const lastUpdate =  await prisma.$queryRaw<any[]>`SELECT DISTINCT p."id", p."name", p."projectBoard", MAX(ga.created_at) from "Projects" p
//         RIGHT JOIN "GitHubActivity" ga on p."id" = ga."projectId"
//         WHERE p."isArchived" = FALSE
//         GROUP BY p."id", p."name", p."projectBoard"
//         `;


// }

export async function getGitHubActivity(db: PrismaClient) {

    const projectsBoards = await prisma.$queryRaw<any[]>`
        SELECT p."id", p."projectBoard" from "Projects" p
        WHERE p."isArchived" = FALSE and p."projectBoard" is not null
    `;

    projectsBoards.forEach(async project => {
        await getActivity(project.projectBoard, project.id);
    })

}
