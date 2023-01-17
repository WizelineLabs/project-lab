import { PrismaClient } from "@prisma/client"
import { migrateProfiles } from "../../app/profileMigration.server";
import { config } from "dotenv-flow"

const db = new PrismaClient()

async function task() {
  console.info(`Loading configuration`);
  config()
  await migrateProfiles(db)
  console.info(`Task finished successfully`);
}

//close connection
task().finally(() => {
  console.info(`Disconnecting DB connection`);
  db.$disconnect()
})
