import { prisma } from "~/db.server"

export type { Labels } from "@prisma/client"

interface ResponseError extends Error {
  code?: string
}

async function validateLabel(id: string) {
  const innovationTier = await prisma.labels.findFirst({
    where: { id },
  })
  if (!innovationTier) {
    const error: ResponseError = new Error("Label not found in DB")
    error.code = "NOT_FOUND"
    throw error
  }
  return
}

export async function getLabels() {
  const labels = await prisma.labels.findMany({
    orderBy: {
      name: "asc",
    },
  })
  return labels
}

export async function addLabel(input: { name: string }) {
  const label = await prisma.labels.create({ data: input })
  return { label }
}

export async function removeLabel({ id }: { id: string }) {
  await validateLabel(id)
  await prisma.labels.deleteMany({ where: { id } })
}

export async function updateLabel({ id, name }: { id: string; name: string }) {
  await validateLabel(id)
  await prisma.labels.update({ where: { id }, data: { name } })
}
