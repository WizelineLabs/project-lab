CREATE EXTENSION IF NOT EXISTS pg_trgm;
CREATE EXTENSION IF NOT EXISTS btree_gin;
CREATE EXTENSION IF NOT EXISTS unaccent;

-- AlterTable
ALTER TABLE "Projects" ADD COLUMN "tsColumn" TSVECTOR
  GENERATED ALWAYS AS
    (
      setweight(to_tsvector('english', coalesce(name, '')), 'A') ||
      setweight(to_tsvector('english', coalesce("description", '')), 'B') ||
      setweight(to_tsvector('english', coalesce("valueStatement", '')), 'B') ||
      setweight(to_tsvector('english', coalesce("searchSkills", '')), 'C')
    )
  STORED;

-- CreateIndex
CREATE INDEX "projects_ts_column_idx" ON "Projects" USING GIN ("tsColumn");

---

-- CreateIndex for Profiles.searchCol
DROP INDEX IF EXISTS profiles_search_col_idx;
CREATE INDEX profiles_search_col_idx ON "Profiles" USING GIN ("searchCol" gin_trgm_ops);

-- Fill values for Profiles.searchCol
DROP TRIGGER IF EXISTS profiles_search_col_trigger ON "Profiles";
UPDATE "Profiles" SET "searchCol" = lower(unaccent("firstName" || ' ' || "lastName") || ' ' || "email");

-- Trigger for Profiles.searchCol
-- Couldn't use a generated column because unaccent is not inmutable.
CREATE OR REPLACE FUNCTION profiles_search_col_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  NEW."searchCol" := lower(unaccent(NEW."firstName" || ' ' || NEW."lastName") || ' ' || NEW."email");
  RETURN NEW;
END;
$body$;

CREATE TRIGGER profiles_search_col_trigger
  BEFORE INSERT OR UPDATE
  ON "Profiles"
  FOR EACH ROW
  EXECUTE FUNCTION profiles_search_col_fn();

---

CREATE OR REPLACE FUNCTION project_members_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "role", "active", "practicedSkills")
    VALUES (new."projectId", new."profileId", new."hoursPerWeek", new.role, new.active, '');
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "role", "active", "practicedSkills")
    VALUES (new."projectId", new."profileId", new."hoursPerWeek", new.role, new.active, '');
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "role", "active", "practicedSkills")
    VALUES (old."projectId", old."profileId", 0, '', false, '');
  END IF;
  RETURN NULL;
END;
$body$;

CREATE TRIGGER project_members_versions_trigger
  AFTER INSERT OR UPDATE OR DELETE
  ON "ProjectMembers"
  FOR EACH ROW
  EXECUTE FUNCTION project_members_versions_fn();

---

CREATE OR REPLACE FUNCTION practiced_skills_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  UPDATE "ProjectMembersVersions"
  SET
    "updatedAt" = CURRENT_TIMESTAMP,
    "practicedSkills" = (SELECT string_agg(_pms."B", ',') FROM "_ProjectMembersToSkills" _pms WHERE _pms."A" = new."A")
  WHERE id = (
    SELECT v.id FROM "ProjectMembers" pm
    INNER JOIN "ProjectMembersVersions" v ON pm."profileId" = v."profileId" AND pm."projectId" = v."projectId"
    WHERE pm.id = new."A"
    ORDER BY v."createdAt" DESC LIMIT 1
  );
  RETURN NULL;
END;
$body$;

CREATE TRIGGER practiced_skills_versions_trigger
  AFTER INSERT OR UPDATE
  ON "_ProjectMembersToSkills"
  FOR EACH ROW
  EXECUTE FUNCTION practiced_skills_versions_fn();

---

CREATE OR REPLACE FUNCTION innovation_tier_default_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  IF
    exists(SELECT "defaultRow" FROM "InnovationTiers" WHERE "defaultRow" = true)
    AND (
      (TG_OP = 'INSERT' AND NEW."defaultRow" = true)
      OR (TG_OP = 'UPDATE' AND NEW."defaultRow" = true AND OLD."defaultRow" = false)
    )
  THEN
    raise using
      errcode='DTIER',
      message='default tier already exists';
  ELSE
    RETURN NEW;
  END IF;
END;
$body$;

CREATE TRIGGER innovation_tier_default_trigger
  BEFORE INSERT OR UPDATE
  ON "InnovationTiers"
  FOR EACH ROW
  EXECUTE FUNCTION innovation_tier_default_fn();
