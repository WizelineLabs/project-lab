/*
  Warnings:

  - You are about to drop the column `categoryName` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `positions` on the `Projects` table. All the data in the column will be lost.
  - You are about to drop the column `categoryName` on the `ProjectsVersions` table. All the data in the column will be lost.
  - You are about to drop the column `positions` on the `ProjectsVersions` table. All the data in the column will be lost.
  - You are about to drop the `Category` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `projectId` to the `ProjectsVersions` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Projects" DROP CONSTRAINT "Projects_categoryName_fkey";

-- DropForeignKey
ALTER TABLE "ProjectsVersions" DROP CONSTRAINT "ProjectsVersions_categoryName_fkey";

-- DropIndex
DROP INDEX "projects_category_idx";

-- DropIndex
DROP INDEX "projects_version_category_idx";

-- AlterTable
ALTER TABLE "Projects" DROP COLUMN "categoryName",
DROP COLUMN "positions";

-- AlterTable
ALTER TABLE "ProjectsVersions" DROP COLUMN "categoryName",
DROP COLUMN "positions",
DROP COLUMN "updatedAt",
ADD COLUMN     "projectId" TEXT NOT NULL,
ADD COLUMN     "tierName" TEXT DEFAULT E'Tier 3 (Experiment)';

-- DropTable
DROP TABLE "Category";

-- CreateIndex
CREATE INDEX "projects_version_tier_idx" ON "ProjectsVersions"("tierName");

-- AddForeignKey
ALTER TABLE "ProjectsVersions" ADD CONSTRAINT "ProjectsVersions_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectsVersions" ADD CONSTRAINT "ProjectsVersions_tierName_fkey" FOREIGN KEY ("tierName") REFERENCES "InnovationTiers"("name") ON DELETE SET NULL ON UPDATE CASCADE;

---

CREATE OR REPLACE FUNCTION project_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    INSERT INTO "ProjectsVersions"("projectId", "ownerId", "name", "logo", "description", "valueStatement", "target", "demo", "slackChannel", "isApproved", "status", "tierName", "searchSkills", "isArchived", "membersCount", "votesCount")
    VALUES (new.id, new."ownerId", new."name", new.logo, new.description, new."valueStatement", new."target", new.demo, new."slackChannel", new."isApproved", new."status", new."tierName", new."searchSkills", new."isArchived",
      (SELECT count(*) FROM "ProjectMembers" WHERE "projectId" = new.id AND "active" = TRUE),
      (SELECT count(*) FROM "Vote" WHERE "projectId" = new.id)
    );
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO "ProjectsVersions"("projectId", "ownerId", "name", "logo", "description", "valueStatement", "target", "demo", "slackChannel", "isApproved", "status", "tierName", "searchSkills", "isArchived", "membersCount", "votesCount")
    VALUES (old.id, old."ownerId", old."name", '', '', '', '', '', '', FALSE, old."status", old."tierName", '', TRUE, 0, 0);
  END IF;
  RETURN NULL;
END;
$body$;

CREATE TRIGGER project_versions_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "Projects"
  FOR EACH ROW
  EXECUTE FUNCTION project_versions_fn();

-- INSERT first project version from createdAt
INSERT INTO "ProjectsVersions"("projectId", "createdAt", "ownerId", "name", "logo", "description", "valueStatement", "target", "demo", "slackChannel", "isApproved", "status", "tierName", "searchSkills", "isArchived", "membersCount", "votesCount")
  (SELECT p.id, p."createdAt", p."ownerId", p."name", p.logo, p."description", p."valueStatement", p."target", p.demo, p."slackChannel", p."isApproved", p."status", p."tierName", p."searchSkills", p."isArchived",
    1, 0
    FROM "Projects" p
  );

-- INSERT second project version from updatedAt
INSERT INTO "ProjectsVersions"("projectId", "createdAt", "ownerId", "name", "logo", "description", "valueStatement", "target", "demo", "slackChannel", "isApproved", "status", "tierName", "searchSkills", "isArchived", "membersCount", "votesCount")
  (SELECT p.id, p."updatedAt", p."ownerId", p."name", p.logo, p."description", p."valueStatement", p."target", p.demo, p."slackChannel", p."isApproved", p."status", p."tierName", p."searchSkills", p."isArchived",
    count(DISTINCT pm."profileId") as "membersCount",
    count(DISTINCT v."profileId") as "votesCount"
    FROM "Projects" p
    LEFT JOIN "ProjectMembers" pm ON pm."projectId" = p.id
    LEFT JOIN "Vote" v ON v."projectId" = p.id
    GROUP BY p.id
  );
