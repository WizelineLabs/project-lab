import { PrismaClient } from "@prisma/client";
import { terminateInactiveProfiles } from "../app/terminateProfiles.server";

const db = new PrismaClient();

async function task() {
    console.info(`Loading configuration`);
    await terminateInactiveProfiles(db);
    console.info(`Task finished successfully`);
}

//close connection
task().finally(() => {
    console.info(`Disconnecting DB connection`);
    db.$disconnect();
});
