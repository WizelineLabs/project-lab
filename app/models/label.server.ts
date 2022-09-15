import { prisma } from "~/db.server"

export type { Labels } from "@prisma/client"

export async function getLabels() {
  const labels = await prisma.labels.findMany({
    orderBy: {
      name: "asc",
    },
  })
  return labels
}

export async function addLabel(input: { name: string }) {
  try {
    const label = await prisma.labels.create({ data: input })
    return { label, error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}

export async function removeLabel({ id }: { id: string }) {
  try {
    const labels = await prisma.labels.findFirst({ where: { id } })
    if (!labels) {
      return { error: "Label not found in DB" }
    }
    await prisma.labels.deleteMany({ where: { id } })
    return { error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}

export async function updateLabel({ id, name }: { id: string; name: string }) {
  try {
    const labels = await prisma.labels.findFirst({ where: { id } })
    if (!labels) {
      return { error: "Label not found in DB" }
    }
    await prisma.labels.update({ where: { id }, data: { name } })
    return { error: "" }
  } catch (e) {
    throw new Error(JSON.stringify(e))
  }
}
