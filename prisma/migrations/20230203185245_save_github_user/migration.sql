-- DropIndex
DROP INDEX "profiles_search_col_idx";

-- DropIndex
DROP INDEX "projects_ts_column_idx";

-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "githuUser" TEXT;

-- AlterTable


-- CreateIndex
CREATE INDEX "profiles_search_col_idx" ON "Profiles"("searchCol");

-- CreateIndex
CREATE INDEX "projects_ts_column_idx" ON "Projects"("tsColumn");
