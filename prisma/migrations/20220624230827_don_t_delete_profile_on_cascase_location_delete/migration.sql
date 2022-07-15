-- DropForeignKey
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_jobTitleId_fkey";

-- DropForeignKey
ALTER TABLE "Profiles" DROP CONSTRAINT "Profiles_locationId_fkey";

-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_ownerId_fkey";

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_jobTitleId_fkey" FOREIGN KEY ("jobTitleId") REFERENCES "JobTitles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Profiles" ADD CONSTRAINT "Profiles_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Locations"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Projects" ADD CONSTRAINT "Projects_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
