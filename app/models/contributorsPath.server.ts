import type { Profiles, Projects } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { defaultStatus, contributorPath } from "~/constants";
import { joinCondition, prisma as db } from "~/db.server";

export async function createStage(data:{
  name: string,
  projectId: string,
  criteria: string,
  mission: string,
  // position: number
}
) {

    await db.$transaction(async (tx) => {

      const numberOfStages = await tx.projectStages.count({
        where:{projectId:data.projectId}
      })
      const position = numberOfStages+1;

      
      const stage = await db.projectStages.create({
        data: {
          name: data.name,
          project: { connect: { id: data.projectId } },
          mission: data.mission,
          criteria: data.criteria,
          position,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      });
      
      return stage;
    })
}

export async function updateStage(input: any) {
  const stage = await db.projectStages.update({
    data: {
      name: input.name,
      criteria: input.criteria,
      mission: input.mission,
      position: input.position,
      updatedAt: new Date(),
    },
    where: { id: input.id },
  });
  return stage;
}

export async function deleteStage(id: string) {
  const stage = await db.projectStages.delete({ where: { id } });
  return stage;
}

export async function updateStagePosition(id: string) {
  const stages = await db.projectStages.findMany({
    where: {
      projectId: id,
    },
    orderBy: {
      position: "asc",
    },
  });

  return await db.$transaction(async (tx) => {
    const updateResponse:any = [];
    let response;
    for (let i = 0; i < stages.length; i++){
        const newPosition = i + 1;
        const stage = stages[i];
        if (stage.position !== newPosition) {
          response = await tx.projectStages.update({
            where: { id: stage.id },
            data: { position: newPosition },
          });
  
          updateResponse.push(response);
        }
      }
      return { updateResponse };
  });
}

export async function createTask(input: {
  description: string;
  position: number;
  projectStageId: string;
}) {
  const task = await db.projectTasks.create({
    data: {
      description: input.description,
      projectStage: { connect: { id: input.projectStageId } },
      position: input.position,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  return task;
}

export async function updateTask(input: any) {
  const task = await db.projectTasks.update({
    data: {
      description: input.description,
      position: input.position,
      updatedAt: new Date(),
    },
    where: { id: input.id },
  });
  return task;
}

export async function deleteTask(id: string) {
  const task = await db.projectTasks.delete({ where: { id } });
  return task;
}

export async function updateTaskPosition(id: string) {
  const tasks = await db.projectTasks.findMany({
    where: {
      projectStageId: id,
    },
    orderBy: {
      position: "asc",
    },
  });

  return await db.$transaction(async (tx) => {
    const updateResponse:any = [];
    let response;
    for (let i = 0; i < tasks.length; i++){
        const newPosition = i + 1;
        const task = tasks[i];
        if (task.position !== newPosition) {
          response = await tx.projectTasks.update({
            where: { id: task.id },
            data: { position: newPosition },
          });
  
          updateResponse.push(response);
        }
      }
      return { updateResponse };
  });
}
