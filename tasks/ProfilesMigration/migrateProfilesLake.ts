import { PrismaClient } from "@prisma/client";
import { migrateProfiles } from "../../app/profileMigration.server";

const db = new PrismaClient();

async function task() {
  console.info(`Loading configuration`);
  await migrateProfiles(db);
  console.info(`Task finished successfully`);
}

//close connection
task().finally(() => {
  console.info(`Disconnecting DB connection`);
  db.$disconnect();
});
