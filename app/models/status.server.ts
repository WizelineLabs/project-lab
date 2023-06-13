import { prisma } from "~/db.server"

export type { ProjectStatus } from "@prisma/client"

type updateProjectStatusType = {
  id: string
  name: string
  stage?: "idea" | "ongoing project" | "none" | null
}

interface ResponseError extends Error {
  code?: string
}

async function validateProjectStatus(name: string) {
  const projectStatus = await prisma.projectStatus.findFirst({
    where: { name },
  })
  if (!projectStatus) {
    const error: ResponseError = new Error("Project Status not found in DB")
    error.code = "NOT_FOUND"
    throw error
  }
  return
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
  const data = {
    name,
    ...(stage ? { stage } : null),
  }
  const projectStatus = await prisma.projectStatus.create({ data })
  return { projectStatus }
}

export async function removeProjectStatus({ name }: { name: string }) {
  await validateProjectStatus(name)
  await prisma.projectStatus.deleteMany({ where: { name } })
}

export async function updateProjectStatus({ id, name, stage }: updateProjectStatusType) {
  await validateProjectStatus(id)
  const data = {
    name,
    stage,
  }

  if (stage === "none") {
    data.stage = null
  }
  await prisma.projectStatus.update({ where: { name: id }, data })
}
