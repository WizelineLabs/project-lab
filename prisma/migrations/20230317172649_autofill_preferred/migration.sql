-- Autofill values for Profiles.preferredName
DROP TRIGGER IF EXISTS profiles_preferred_name_trigger ON "Profiles";
UPDATE "Profiles" SET "preferredName" = "firstName" WHERE "preferredName" IS NULL;

-- Trigger for Profiles.searchCol
CREATE OR REPLACE FUNCTION profiles_search_col_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  NEW."preferredName" := coalesce(NEW."preferredName", NEW."firstName");
  RETURN NEW;
END;
$body$;

CREATE TRIGGER profiles_preferred_name_trigger
  BEFORE INSERT OR UPDATE
  ON "Profiles"
  FOR EACH ROW
  EXECUTE FUNCTION profiles_search_col_fn();
