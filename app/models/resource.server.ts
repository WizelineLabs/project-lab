import { prisma as db } from "~/db.server";

export async function getResourceTypes() {
  return db.resource.findMany({ select: { type: true }, distinct: ["type"] });
}

export async function getResourceProviders() {
  return db.resource.findMany({
    select: { provider: true },
    distinct: ["provider"],
  });
}

export async function getResourceNames() {
  return db.resource.findMany({ select: { name: true }, distinct: ["name"] });
}

export async function getDistinctResources() {
  const promises = [
    db.resource.findMany({
      select: { type: true, provider: true, name: true },
      distinct: ["type"],
    }),
    db.resource.findMany({
      select: { type: true, provider: true, name: true },
      distinct: ["provider"],
    }),
    db.resource.findMany({
      select: { type: true, provider: true, name: true },
      distinct: ["name"],
    }),
  ];
  const responses = await Promise.all(promises);

  return {
    types: responses[0].map((value) => value.type),
    providers: responses[1].map((value) => value.provider),
    names: responses[2].map((value) => value.name),
  };
}
