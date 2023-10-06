import { getActivity } from "./routes/api/github/get-proyectActivity";
import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();


// export async function searchLastUpdateProjects() {

//     const lastUpdate =  await prisma.$queryRaw<any[]>`SELECT DISTINCT p."id", p."name", p."projectBoard", MAX(ga.created_at) from "Projects" p
//         RIGHT JOIN "GitHubActivity" ga on p."id" = ga."projectId"
//         WHERE p."isArchived" = FALSE
//         GROUP BY p."id", p."name", p."projectBoard"
//         `;


// }

export async function getGitHubActivity() {
    // console.log('getGitHubActivity');
    const projectsBoards = await db.$queryRaw<any[]>`
        SELECT p."id", p."name", r."url" from "Projects" p
        RIGHT JOIN "Repos" r on p."id" = r."projectId"
        WHERE p."isArchived" = FALSE and p."projectBoard" is not null
    `;
    // console.log(projectsBoards[9].url, projectsBoards[9].id);

    try{
        await getActivity(projectsBoards[9].url, projectsBoards[9].id).catch((e) => {throw(e)});
    }catch(e){
        throw (e);
    }

    // projectsBoards.forEach(async project => {
    //     await getActivity(project.projectBoard, project.id, db);
    // })

}
