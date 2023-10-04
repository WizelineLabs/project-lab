import { PrismaClient } from "@prisma/client";
import { getGitHubActivity } from "~/githubUpdates.server";

const db = new PrismaClient();

async function task() {
    console.info(`Loading configuration`);
    await getGitHubActivity();
    console.info(`Task github activity finished successfully`);
}

//close connection
task().finally(() => {
    console.info(`Disconnecting DB connection`);
    db.$disconnect();
});