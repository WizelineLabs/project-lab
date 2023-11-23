import { prisma } from "../db.server";
import type { PrismaClient } from "@prisma/client";

export async function saveRelease(
    id: string,
    body: string,
    name: string,
    tagName: string,
    author: string,
    prerealease: boolean,
    created_at: string,
    projectId: string,
    link: string,
    db?: PrismaClient
  ){

    const dbConnection = db ? db : prisma;
    
    const releaseRegister = await dbConnection.gitHubReleases.findFirst({ where: { id } });

    if(!releaseRegister) {

        return await dbConnection.gitHubReleases.create({
            data: {
                id,
                body,
                name,
                tagName,
                author,
                prerealease,
                created_at: new Date(created_at),
                projectId,
                link,
            }
        })
    }

}

export async function getReleasesListData(projectId: string) {
    return await prisma.gitHubReleases.findMany({ where: { projectId }, orderBy: { created_at: "desc" }});
}