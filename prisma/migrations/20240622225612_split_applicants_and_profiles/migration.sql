delete from "Profiles" where email in (select email from "Applicant");

alter table "User" add column "avatarUrl" text;
