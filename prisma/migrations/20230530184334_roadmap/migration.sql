/*
  Warnings:

  - Made the column `preferredName` on table `Profiles` required. This step will fail if there are existing NULL values in that column.

*/


-- CreateTable
CREATE TABLE "ProjectObjectives" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "input" TEXT NOT NULL,
    "result" TEXT NOT NULL,
    "quarter" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "projectId" TEXT NOT NULL,

    CONSTRAINT "ProjectObjectives_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "project_objective_project_id_idx" ON "ProjectObjectives"("projectId");
