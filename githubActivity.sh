mkdir -p /home/admin/logs/githubjobs
LOGFILE="/home/admin/logs/githubjobs/projectsActivity-"$(date "+%Y%m%d%H%M%S")".log"
cd /home/admin/projectlab/app
npx ts-node --project ./ts-node.tsconfig.json ./tasks/GitHubDataManage/getGitHubActivityByProject.ts >> $LOGFILE