-- fill values for Profiles.preferredName
-- new ones will be inserted by our data lake import script
UPDATE "Profiles" SET "preferredName" = "firstName" WHERE "preferredName" IS NULL;
ALTER TABLE "Profiles" ALTER COLUMN "preferredName" SET NOT NULL;

-- Fill values for Profiles.searchCol adding preferred name
DROP TRIGGER IF EXISTS profiles_search_col_trigger ON "Profiles";

-- create inmutable unaccent function
-- https://dba.stackexchange.com/questions/177020/creating-a-case-insensitive-and-accent-diacritics-insensitive-search-on-a-field
-- https://stackoverflow.com/questions/11005036/does-postgresql-support-accent-insensitive-collations/11007216#11007216
CREATE OR REPLACE FUNCTION f_unaccent(text)
  RETURNS text AS
$func$
SELECT public.unaccent('public.unaccent', $1)  -- schema-qualify function and dictionary
$func$
LANGUAGE sql
IMMUTABLE;

ALTER TABLE "Profiles" DROP COLUMN "searchCol";
ALTER TABLE "Profiles" ADD COLUMN "searchCol" text
  GENERATED ALWAYS AS
  (
    lower(f_unaccent("firstName" || ' ' || "preferredName" || ' ' || "lastName") || ' ' || "email")
  ) STORED;
