/*
  Warnings:

  - You are about to drop the column `deleted` on the `Profiles` table. All the data in the column will be lost.
  - You are about to drop the column `status` on the `Profiles` table. All the data in the column will be lost.
  - You are about to drop the column `terminatedAt` on the `Profiles` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "profiles_status_idx";

-- AlterTable
ALTER TABLE "Profiles" DROP COLUMN "deleted",
DROP COLUMN "status",
DROP COLUMN "terminatedAt",
ADD COLUMN     "benchStatus" TEXT,
ADD COLUMN     "businessUnit" TEXT,
ADD COLUMN     "employeeStatus" TEXT;

-- CreateIndex
CREATE INDEX "profiles_employee_status_idx" ON "Profiles"("employeeStatus");

-- CreateIndex
CREATE INDEX "profiles_bench_status_idx" ON "Profiles"("benchStatus");
