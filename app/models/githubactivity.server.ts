import { prisma } from "../db.server";
import type { PrismaClient } from "@prisma/client";

interface gitHubActivityChartType {
    count: number,
    typeEvent: string,
}

export async function saveActivity(
    id: string,
    typeEvent: string,
    created_at: string,
    author: string,
    avatar_url: string,
    projectId: string,
    db?: PrismaClient
  ){
    
    const dbConnection = db ? db : prisma;
    
    const activityRegister = await dbConnection.gitHubActivity.findFirst({ where: { id } });

    if(!activityRegister) {

        return await dbConnection.gitHubActivity.create({
            data: {
                id,
                typeEvent,
                created_at: new Date(created_at),
                author,
                avatar_url,
                projectId
            }
        })
    }
  }


export async function getGitActivityData(projectId: string) {
    return await prisma.gitHubActivity.findMany({ where: { projectId }, orderBy: { id: "desc" }});
}

export const getActivityStadistic = async (week: number) => {
    return  await prisma.$queryRaw<gitHubActivityChartType[]>`SELECT Count(*)::int, "typeEvent" FROM "GitHubActivity" where  date_part('week', "created_at")=${week} GROUP BY "typeEvent"`;

}

