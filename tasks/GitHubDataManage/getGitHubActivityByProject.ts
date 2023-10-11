import { getGitHubActivity } from "../../app/githubUpdates.server";

async function task() {
    console.info(`Loading configuration`);
    try{
        await getGitHubActivity();
    }catch(e){
        console.error(e);
    }
    console.info(`Task github activity finished successfully`);
}

task().finally(() => {
    console.info(`Disconnecting DB connection`);
});