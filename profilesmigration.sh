#!/bin/bash
mkdir -p /home/admin/projectlab/logs/profilesmigration
LOGFILE="/home/admin/projectlab/logs/profilesmigration/profilesmigration-"$(date "+%Y%m%d%H%M%S")".log"
cd /home/admin/projectlab/app
npx ts-node --project ./ts-node.tsconfig.json ./tasks/ProfilesMigration/migrateProfilesLake.ts >> $LOGFILE
