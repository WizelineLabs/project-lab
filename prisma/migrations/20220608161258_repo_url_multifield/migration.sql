/*
  Warnings:

  - You are about to drop the column `repoUrl` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `repoUrl` on the `ProjectsVersions` table. All the data in the column will be lost.

*/

-- CreateTable
CREATE TABLE "Repos" (
    "id" SERIAL NOT NULL,
    "url" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "Repos_pkey" PRIMARY KEY ("id")
);

INSERT INTO "Repos" ( "url", "createdAt", "updatedAt", "projectId") SELECT "repoUrl", "createdAt", "updatedAt", "id" FROM "Projects" WHERE "repoUrl" IS NOT NULL;

-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "repoUrl";

-- AlterTable
ALTER TABLE "ProjectsVersions" DROP COLUMN "repoUrl";

-- AddForeignKey
ALTER TABLE "Repos" ADD CONSTRAINT "Repos_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
