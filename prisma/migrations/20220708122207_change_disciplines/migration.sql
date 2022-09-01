/*
  Warnings:

  - You are about to drop the column `role` on the `ProjectMembers` table. All the data in the column will be lost.

*/
-- CreateTable
CREATE TABLE "_DisciplinesToProjectMembers" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_DisciplinesToProjectMembers_AB_unique" ON "_DisciplinesToProjectMembers"("A", "B");

-- CreateIndex
CREATE INDEX "_DisciplinesToProjectMembers_B_index" ON "_DisciplinesToProjectMembers"("B");

-- AddForeignKey
ALTER TABLE "_DisciplinesToProjectMembers" ADD CONSTRAINT "_DisciplinesToProjectMembers_A_fkey" FOREIGN KEY ("A") REFERENCES "Disciplines"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_DisciplinesToProjectMembers" ADD CONSTRAINT "_DisciplinesToProjectMembers_B_fkey" FOREIGN KEY ("B") REFERENCES "ProjectMembers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE OR REPLACE FUNCTION roles_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  UPDATE "ProjectMembersVersions"
  SET
    "updatedAt" = CURRENT_TIMESTAMP,
    "role" = (SELECT string_agg(_dpm."A", ',') FROM "_DisciplinesToProjectMembers" _dpm WHERE _dpm."B" = new."B")
  WHERE id = (
    SELECT v.id FROM "ProjectMembers" pm
    INNER JOIN "ProjectMembersVersions" v ON pm."profileId" = v."profileId" AND pm."projectId" = v."projectId"
    WHERE pm.id = new."B"
    ORDER BY v."createdAt" DESC LIMIT 1
  );
  RETURN NULL;
END;
$body$;

CREATE TRIGGER roles_versions_trigger
  AFTER INSERT OR UPDATE
  ON "_DisciplinesToProjectMembers"
  FOR EACH ROW
  EXECUTE FUNCTION roles_versions_fn();

-- Insert new Disciplines
CREATE EXTENSION pgcrypto; -- allow generating UUIDs from postgres

INSERT INTO "Disciplines" VALUES
(gen_random_uuid(), 'Owner'),
(gen_random_uuid(), 'Stakeholder'),
(gen_random_uuid(), 'Consultant')
ON CONFLICT do nothing;

-- Procedure to migrate old roles into the new table
CREATE TABLE temps (
  old_discipline TEXT,
  discipline TEXT
);

INSERT INTO temps VALUES
('Android developer', 'Android Engineer'),
('Android Developer', 'Android Engineer'),
('ANDROID DEVELOPER', 'Android Engineer'),
('Android Developer/Project Manager', 'Android Engineer'),
('Android Developer/Tech Lead', 'Android Engineer'),
('Android Develper', 'Android Engineer'),
('Android Engineer', 'Android Engineer'),
('Backend', 'Backend'),
('Backend Developer', 'Backend'),
('Backend Engineer', 'Backend'),
('Backend Engineer/co-leader', 'Backend'),
('Backend Engineer/ Reviewer', 'Backend'),
('Backend Engineer/Infrastructure', 'Backend'),
('Backend/Team Manager', 'Backend'),
('Backend / Unity Developer', 'Backend'),
('Business Stakeholder', 'Stakeholder'),
('Data Engineer', 'Data Engineer'),
('Data Scientist', 'Data Scientist'),
('Designer', 'UX Designer'),
('Devops', 'Site Reliability Engineer'),
('DevOps', 'Site Reliability Engineer'),
('FE Developer', 'Frontend'),
('Frontend', 'Frontend'),
('Frontend Developer', 'Frontend'),
('Front End Developer', 'Frontend'),
('Front-End Developer', 'Frontend'),
('Frontend Developer/React', 'Frontend'),
('Frontend Engineer/co-leader', 'Frontend'),
('Frontend / Unity Developer', 'Frontend'),
('Fullstack', 'Fullstack'),
('FullStack', 'Fullstack'),
(' FullStack', 'Fullstack'),
('Fullstack Developer', 'Fullstack'),
('Full Stack Engineer', 'Fullstack'),
('Functional QA Engineer III', 'Automation QA'),
('Infraestructure / Backend', 'Backend'),
('iOS', 'iOS Engineer'),
('iOS Developer', 'iOS Engineer'),
('iOS Developer/Backup Team Manager', 'iOS Engineer'),
('iOS Developer/Tech Lead', 'iOS Engineer'),
('iOS Engineer', 'iOS Engineer'),
('Owner', 'Owner'),
('PM', 'Project Manager'),
('Project Manager', 'Project Manager'),
('Product Manager', 'Product Manager'),
('QA', 'Automation QA'),
('QA Jr.', 'Automation QA'),
('SEE', 'Evolution Engineer'),
('Site Reliability Engineer', 'Site Reliability Engineer'),
('SRE', 'Site Reliability Engineer'),
('Tech Lead', 'Tech Lead'),
('Teach Lead', 'Tech Lead'),
('Tech Lead Frontend', 'Tech Lead'),
('Tech Lead QA', 'Tech Lead'),
('Tech Lead SRE', 'Tech Lead'),
('Team Manager', 'Tech Lead'),
('Technical Writer', 'Technical Writer'),
('Technical writer', 'Technical Writer'),
('Technical Writer ', 'Technical Writer'),
('UI/UX Designer', 'UX Designer'),
('UX', 'UX Designer'),
('UX designer', 'UX Designer'),
('Android Developer/Project Manager', 'Project Manager'),
('Android Developer/Tech Lead', 'Tech Lead'),
('Backend Engineer/co-leader', 'Tech Lead'),
('Backend Engineer/Infrastructure', 'Site Reliability Engineer'),
('Backend/Team Manager', 'Tech Lead'),
('Frontend Engineer/co-leader', 'Tech Lead'),
('Infraestructure / Backend', 'Site Reliability Engineer'),
('iOS Developer/Backup Team Manager', 'Tech Lead'),
('iOS Developer/Tech Lead', 'Tech Lead'),
('Developer', 'Fullstack'),
('Software Engineer', 'Fullstack'),
('Software Engineering', 'Fullstack'),
('SWE', 'Fullstack'),
('UI to YAML', 'Fullstack'),
('Unity Lead Developer', 'Fullstack'),
('Unity Lead Developer', 'Tech Lead'),
('VSCode Ext', 'Fullstack'),
('Web developer', 'Fullstack');

INSERT INTO "_DisciplinesToProjectMembers" SELECT d.id as "A", pm.id as "B" FROM "Disciplines" d
	INNER JOIN "temps" te ON d.name = te.discipline
	INNER JOIN "ProjectMembers" pm ON te.old_discipline = pm.role;

DROP TABLE IF EXISTS "temps";

-- AlterTable
ALTER TABLE "ProjectMembers" DROP COLUMN "role";

-- Modify ProjectMembersVersions function
CREATE OR REPLACE FUNCTION project_members_versions_fn() RETURNS TRIGGER
  LANGUAGE plpgsql AS $body$
BEGIN
  IF (TG_OP = 'INSERT') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "active", "practicedSkills")
    VALUES (new."projectId", new."profileId", new."hoursPerWeek", new.active, '');
  ELSIF (TG_OP = 'UPDATE') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "active", "practicedSkills")
    VALUES (new."projectId", new."profileId", new."hoursPerWeek", new.active, '');
  ELSIF (TG_OP = 'DELETE') THEN
    INSERT INTO "ProjectMembersVersions"("projectId", "profileId", "hoursPerWeek", "role", "active", "practicedSkills")
    VALUES (old."projectId", old."profileId", 0, '', false, '');
  END IF;
  RETURN NULL;
END;
$body$;
