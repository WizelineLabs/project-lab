/*
  Warnings:

  - Added the required column `firstName` to the `GitHubProfile` table without a default value. This is not possible if the table is not empty.
  - Added the required column `lastName` to the `GitHubProfile` table without a default value. This is not possible if the table is not empty.
  - Made the column `preferredName` on table `Profiles` required. This step will fail if there are existing NULL values in that column.

*/


-- AlterTable
ALTER TABLE "GitHubProfile" ADD COLUMN     "firstName" TEXT NOT NULL,
ADD COLUMN     "lastName" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Profiles" ALTER COLUMN "preferredName" SET NOT NULL;

