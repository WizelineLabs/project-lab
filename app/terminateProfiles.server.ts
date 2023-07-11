import type { PrismaClient } from "@prisma/client";
import { getInactiveProfiles } from "./lake.server";
import { terminateProfiles } from "./models/profile.server";

async function getProfilesToTerminate(): Promise<string[]> {
  const inactiveProfiles = await getInactiveProfiles();
  return inactiveProfiles.filter(lakeProfile => lakeProfile.contact__email !== null && lakeProfile.contact__email.length > 0).map(lakeProfile => lakeProfile.contact__email);
}

export async function terminateInactiveProfiles(db: PrismaClient) {
  const inactiveProfiles = await getProfilesToTerminate();
  // const inactiveProfiles = ['test@wizeline.com', 'mauricio.barragan@wizeline.com']
  terminateProfiles(inactiveProfiles, db);
}
