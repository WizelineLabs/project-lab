/*
  Warnings:

  - Added the required column `updatedAt` to the `Applicant` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Applicant" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "updatedBy" TEXT;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_updatedBy_fkey" FOREIGN KEY ("updatedBy") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
