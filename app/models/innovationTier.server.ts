import { prisma } from "~/db.server"

export type { InnovationTiers } from "@prisma/client"

type newInnovationTier = {
  name: string
  benefits: string
  requisites: string
  goals: string
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
  try {
    const innovationTier = await prisma.innovationTiers.create({ data: input })
    return { innovationTier, error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}

export async function removeInnovationTier({ name }: { name: string }) {
  try {
    const innovationTier = await prisma.innovationTiers.findFirst({
      where: { name },
    })
    if (!innovationTier) {
      return { error: "Project Status not found in DB" }
    }
    await prisma.innovationTiers.deleteMany({ where: { name } })
    return { error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}

export async function updateInnovationTier(data: newInnovationTier) {
  try {
    const innovationTier = await prisma.innovationTiers.findFirst({
      where: { name: data.name },
    })
    if (!innovationTier) {
      return { error: "Project Status not found in DB" }
    }
    await prisma.innovationTiers.update({ where: { name: data.name }, data })
    return { error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}
