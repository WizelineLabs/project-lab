/*
  Warnings:

  - Made the column `projectId` on table `GitHubActivity` required. This step will fail if there are existing NULL values in that column.
  - Made the column `projectId` on table `GitHubReleases` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "GitHubActivity" DROP CONSTRAINT "GitHubActivity_projectId_fkey";

-- DropForeignKey
ALTER TABLE "GitHubReleases" DROP CONSTRAINT "GitHubReleases_projectId_fkey";

-- AlterTable
ALTER TABLE "GitHubActivity" ALTER COLUMN "projectId" SET NOT NULL;

-- AlterTable
ALTER TABLE "GitHubReleases" ALTER COLUMN "projectId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "GitHubActivity" ADD CONSTRAINT "GitHubActivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "GitHubReleases" ADD CONSTRAINT "GitHubReleases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
