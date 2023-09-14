import { prisma } from "~/db.server";

export async function saveACtivity(
    id: string,
    typeEvent: string,
    created_at: string,
    author: string,
    avatar_url: string,
    projectId: string
  ){
 
    const activityRegister = await prisma.gitHubActivity.findFirst({ where: { id } });

    if(!activityRegister) {

        return await prisma.gitHubActivity.create({
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

