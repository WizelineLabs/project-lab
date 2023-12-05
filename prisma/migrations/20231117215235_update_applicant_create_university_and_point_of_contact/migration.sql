/*
  Warnings:

  - You are about to drop the column `campus` on the `Applicant` table. All the data in the column will be lost.
  - You are about to drop the column `university` on the `Applicant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Applicant" RENAME COLUMN "university" TO "oldUni";

ALTER TABLE "Applicant" DROP COLUMN "campus",
ADD COLUMN     "universityId" TEXT,
ADD COLUMN     "universityPointOfContactId" TEXT;

-- CreateTable
CREATE TABLE "Universities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityPointsOfContact" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "universityId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityPointsOfContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Universities_name_key" ON "Universities"("name");


-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "Universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_universityPointOfContactId_fkey" FOREIGN KEY ("universityPointOfContactId") REFERENCES "UniversityPointsOfContact"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UniversityPointsOfContact" ADD CONSTRAINT "UniversityPointsOfContact_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "Universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- Insert Values into Universities Table
INSERT INTO "Universities" ("id", "name", "updatedAt", "createdAt")
SELECT DISTINCT gen_random_uuid(), "oldUni" , NOW(), NOW() 
FROM "Applicant" 
ON CONFLICT ("name") DO NOTHING;

-- Update Applicant Table with Foreign Key References
UPDATE "Applicant" AS a
SET "universityId" = u."id"
FROM "Universities" AS u 
WHERE a."oldUni" = u."name";

-- AlterTable
ALTER TABLE "Applicant" DROP COLUMN "oldUni";

