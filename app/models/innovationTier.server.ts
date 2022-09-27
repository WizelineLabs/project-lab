import { prisma } from "~/db.server"

export type { InnovationTiers } from "@prisma/client"

type newInnovationTier = {
  name: string
  benefits: string
  requisites: string
  goals: string
}

interface ResponseError extends Error {
  code?: string
}

async function validateInnovationTier(name: string) {
  const innovationTier = await prisma.innovationTiers.findFirst({
    where: { name },
  })
  if (!innovationTier) {
    const error: ResponseError = new Error("Innovation Tier not found in DB")
    error.code = "NOT_FOUND"
    throw error
  }
  return
}

export async function getInnovationTiers() {
  const InnovationTiers = await prisma.innovationTiers.findMany({
    orderBy: {
      name: "asc",
    },
  })
  return InnovationTiers
}

export async function addInnovationTier(input: newInnovationTier) {
  const innovationTier = await prisma.innovationTiers.create({ data: input })
  return { innovationTier}
}

export async function removeInnovationTier({ name }: { name: string }) {
  await validateInnovationTier(name)
  await prisma.innovationTiers.deleteMany({ where: { name } })
}

export async function updateInnovationTier(data: newInnovationTier) {
  await validateInnovationTier(data.name)
  await prisma.innovationTiers.update({ where: { name: data.name }, data })
}
