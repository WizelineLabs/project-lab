import { prisma as db } from "~/db.server";

export async function createObjective(
    projectId: string,
    name: string,
    input: string,
    result: string,
    quarter: string,
    status: string 
  ) {

    return await db.projectObjectives.create({
        data: {
        name,
        input,
        result,
        quarter,
        status,
        projectId
        }
    })
  }

  export async function getAllObjectives(projectId: string) {
        return await db.projectObjectives.findMany({
            where : {
                projectId
            }
        })
  }