-- AlterTable
ALTER TABLE "Profiles" ADD COLUMN     "country" TEXT,
ADD COLUMN     "location" TEXT,
ADD COLUMN     "preferredName" TEXT,
ADD COLUMN     "status" TEXT;

-- CreateIndex
CREATE INDEX "profiles_location_idx" ON "Profiles"("location");

-- CreateIndex
CREATE INDEX "profiles_country_idx" ON "Profiles"("country");

-- CreateIndex
CREATE INDEX "profiles_status_idx" ON "Profiles"("status");

-- Trigger for Profiles.searchCol
-- Couldn't use a generated column because unaccent is not inmutable.
CREATE OR REPLACE FUNCTION profiles_search_col_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  NEW."searchCol" := lower(unaccent(NEW."preferredName" || ' ' || NEW."firstName" || ' ' || NEW."lastName") || ' ' || NEW."email");
  RETURN NEW;
END;
$body$;

-- Allow deleting profiles, both functions had a bug that prevented delete
CREATE OR REPLACE FUNCTION project_members_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "active", "practicedSkills")
    VALUES (new."projectId", new."profileId", new."hoursPerWeek", new.active, '');
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "active", "practicedSkills")
    VALUES (new."projectId", new."profileId", new."hoursPerWeek", new.active, '');
  END IF;
  RETURN NULL;
END;
$body$;

CREATE OR REPLACE FUNCTION project_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  IF (TG_OP = 'INSERT' OR TG_OP = 'UPDATE') THEN
    INSERT INTO "ProjectsVersions"("projectId", "ownerId", "name", "logo", "description", "valueStatement", "target", "demo", "slackChannel", "isApproved", "status", "tierName", "searchSkills", "isArchived", "membersCount", "votesCount")
    VALUES (new.id, new."ownerId", new."name", new.logo, new.description, new."valueStatement", new."target", new.demo, new."slackChannel", new."isApproved", new."status", new."tierName", new."searchSkills", new."isArchived",
      (SELECT count(*) FROM "ProjectMembers" WHERE "projectId" = new.id AND "active" = TRUE),
      (SELECT count(*) FROM "Vote" WHERE "projectId" = new.id)
    );
  END IF;
  RETURN NULL;
END;
$body$;
