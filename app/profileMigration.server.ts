import type { PrismaClient } from "@prisma/client";
import { getActiveProfiles } from "./lake.server";
import { consolidateProfilesByEmail } from "./models/profile.server";
import type { Prisma } from "@prisma/client";

async function getMappedProfiles(): Promise<Prisma.ProfilesCreateInput[]> {
  const activeProfiles = await getActiveProfiles();
  const mappedProfiles = activeProfiles.map((lakeProfile) => {
    return {
      id: String(lakeProfile.contact__employee_number),
      email: lakeProfile.contact__email,
      firstName: lakeProfile.contact__first_name,
      preferredName: lakeProfile.contact__preferred_name,
      lastName: lakeProfile.contact__last_name,
      department: lakeProfile.contact__department,
      jobLevelTier: lakeProfile.contact__wizeos__level,
      jobLevelTitle: lakeProfile.contact__title,
      avatarUrl: lakeProfile.contact__photo__url,
      location: lakeProfile.contact__location,
      country: lakeProfile.contact__country,
      employeeStatus: lakeProfile.contact__employee_status,
      benchStatus: lakeProfile.contact__status,
      businessUnit: lakeProfile.contact__business_unit,
    };
  });
  return mappedProfiles;
}

export async function migrateProfiles(db: PrismaClient) {
  const mappedProfiles = await getMappedProfiles();
  console.info(`Migrating ${mappedProfiles.length} profiles`);
  consolidateProfilesByEmail(mappedProfiles, db);
}
