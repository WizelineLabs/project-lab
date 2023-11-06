import { prisma } from "../db.server";

export async function saveRelease(
    id: string,
    body: string,
    name: string,
    tagName: string,
    author: string,
    prerealease: boolean,
    created_at: string,
    projectId: string,
    // db?: PrismaClient
  ){

    // const dbConnection = db ? db : prisma;
    
    const releaseRegister = await prisma.gitHubReleases.findFirst({ where: { id } });

    if(!releaseRegister) {

        return await prisma.gitHubReleases.create({
            data: {
                id,
                body,
                name,
                tagName,
                author,
                prerealease,
                created_at: new Date(created_at),
                projectId,
            }
        })
    }

}

export async function getReleasesListData(projectId: string) {
    return await prisma.gitHubReleases.findMany({ where: { projectId }, orderBy: { created_at: "desc" }});
}