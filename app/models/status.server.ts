import { prisma } from "~/db.server"

export type { ProjectStatus } from "@prisma/client"

export async function getProjectStatuses() {
  const projectStatuses = await prisma.projectStatus.findMany({
    orderBy: {
      name: "asc",
    },
  })
  return projectStatuses
}

export async function addProjectStatus(input: { name: string }) {
  try {
    const projectStatus = await prisma.projectStatus.create({ data: input })
    return { projectStatus, error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}

export async function removeProjectStatus({ name }: { name: string }) {
  try {
    const projectStatuses = await prisma.projectStatus.findFirst({
      where: { name },
    })
    if (!projectStatuses) {
      return { error: "Project Status not found in DB" }
    }
    await prisma.projectStatus.deleteMany({ where: { name } })
    return { error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}

export async function updateProjectStatus({ id, name }: { id: string; name: string }) {
  try {
    const projectStatuses = await prisma.projectStatus.findFirst({
      where: { name: id },
    })
    if (!projectStatuses) {
      return { error: "Project Status not found in DB" }
    }
    await prisma.projectStatus.update({ where: { name: id }, data: { name } })
    return { error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}
