import { prisma } from "~/db.server"

export type { ProjectStatus } from "@prisma/client"

type updateProjectStatusType = {
  id: string
  name: string
  stage?: "idea" | "ongoing project" | "none" | null
}

export async function getProjectStatuses() {
  const projectStatuses = await prisma.projectStatus.findMany({
    orderBy: {
      name: "asc",
    },
  })
  return projectStatuses
}

export async function addProjectStatus({ name, stage }: { name: string; stage?: string }) {
  try {
    const data = {
      name,
      ...(stage ? { stage } : null),
    }
    const projectStatus = await prisma.projectStatus.create({ data })
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

export async function updateProjectStatus({ id, name, stage }: updateProjectStatusType) {
  try {
    const projectStatuses = await prisma.projectStatus.findFirst({
      where: { name: id },
    })
    if (!projectStatuses) {
      return { error: "Project Status not found in DB" }
    }
    const data = {
      name,
      stage,
    }

    if (stage === "none") {
      data.stage = null
    }

    await prisma.projectStatus.update({ where: { name: id }, data })
    return { error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}
