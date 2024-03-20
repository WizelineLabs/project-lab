import { UpdateObjectExpression } from "kysely/dist/cjs/parser/update-set-parser";
import { db } from "~/db.server";
import { DB } from "~/kysely";

export async function createApplicant(
  email: string,
  personalEmail: string,
  fullName: string,
  nationality: string,
  country: string,
  dayOfBirth: Date,
  homeAddress: string,
  phone: string,
  universityEmail: string,
  emergencyContactName: string,
  emergencyContactPhone: string,
  emergencyRelationship: string,
  gender: string,
  englishLevel: string,
  universityId: string,
  pointOfContactId: string | undefined,
  major: string,
  semester: string,
  graduationDate: Date,
  interest: string,
  experience: string,
  cvLink: string,
  interestedRoles: string,
  preferredTools: string,
  startDate: Date,
  endDate: Date,
  hoursPerWeek: number,
  howDidYouHearAboutUs: string,
  participatedAtWizeline: boolean,
  wizelinePrograms: string,
  comments: string,
  avatarApplicant: string
) {
  return db
    .insertInto("Applicant")
    .values({
      email,
      personalEmail,
      fullName,
      nationality,
      country,
      dayOfBirth,
      homeAddress,
      phone,
      universityEmail,
      emergencyContactName,
      emergencyContactPhone,
      emergencyRelationship,
      gender,
      englishLevel,
      universityId,
      major,
      semester,
      graduationDate,
      interest,
      experience,
      cvLink,
      interestedRoles,
      preferredTools,
      startDate,
      endDate,
      hoursPerWeek,
      howDidYouHearAboutUs,
      participatedAtWizeline,
      wizelinePrograms,
      comments,
      avatarApplicant,
      universityPointOfContactId: pointOfContactId,
    })
    .returning(["id", "fullName", "email", "startDate", "endDate"]);
}

export async function addAppliedProject(
  email: string,
  projectName: string,
  projectId: string
) {
  const existingApplicant = await db
    .selectFrom("Applicant")
    .select(["id", "fullName", "appliedProjects", "appliedProjectsId"])
    .where("email", "=", email)
    .executeTakeFirstOrThrow();
  if (!existingApplicant) {
    throw new Error("Applicant not found");
  }
  const appliedProjectsString = existingApplicant.appliedProjects || "";
  const updatedProjectsString = appliedProjectsString.concat(
    appliedProjectsString ? `,${projectName}` : projectName
  );
  const appliedProjectsIdString = existingApplicant.appliedProjectsId || "";
  const updatedProjectsIdString = appliedProjectsIdString.concat(
    appliedProjectsIdString ? `,${projectId}` : projectId
  );
  await db.updateTable("Applicant").where("id", "=", existingApplicant.id).set({
    appliedProjects: updatedProjectsString,
    appliedProjectsId: updatedProjectsIdString,
  });
}

export async function getAppliedProjectsByEmail(email: string) {
  const existingApplicant = await db
    .selectFrom("Applicant")
    .select("appliedProjects")
    .where("email", "=", email)
    .executeTakeFirstOrThrow();

  if (!existingApplicant || !existingApplicant.appliedProjects) {
    return [];
  }

  return existingApplicant.appliedProjects.split(",");
}

export async function searchApplicants() {
  return await db
    .selectFrom("Applicant as a")
    .innerJoin("Universities as u", "a.universityId", "u.id")
    .leftJoin(
      "UniversityPointsOfContact as poc",
      "a.universityPointOfContactId",
      "poc.id"
    )
    .selectAll("a")
    .select(["u.name as universityName", "poc.fullName as pocName"])
    .where(
      "startDate",
      ">=",
      new Date(Date.now() - 60 * 60 * 24 * 30 * 3 /** months **/ * 1000)
    )
    .execute();
}

export async function getApplicantByEmail(email: string) {
  const applicant = await db
    .selectFrom("Applicant as a")
    .innerJoin("Universities as u", "a.universityId", "u.id")
    .leftJoin("Profiles as m", "a.mentorId", "m.id")
    .leftJoin("Projects as p", "a.projectId", "p.id")
    .leftJoin(
      "UniversityPointsOfContact as poc",
      "a.universityPointOfContactId",
      "poc.id"
    )
    .selectAll("a")
    .select([
      "u.name as universityName",
      "poc.fullName as pocName",
      "p.name as projectName",
      "p.ownerId",
      "m.preferredName as mentorPreferredName",
      "m.lastName as mentorLastName",
    ])
    .where("a.email", "=", email)
    .executeTakeFirst();

  if (!applicant) {
    return null;
  }

  const projectMembers = await db
    .selectFrom("ProjectMembers")
    .select(["profileId"])
    .where("projectId", "=", applicant.projectId)
    .execute();

  return { ...applicant, projectMembers };
}

export async function existApplicant(email: string) {
  const existingApplicant = await db
    .selectFrom("Applicant")
    .select("id")
    .where("email", "=", email)
    .executeTakeFirst();
  return existingApplicant ? true : false;
}

export async function getApplicantById(id: string) {
  const applicant = await db
    .selectFrom("Applicant as a")
    .innerJoin("Universities as u", "a.universityId", "u.id")
    .leftJoin("Profiles as m", "a.mentorId", "m.id")
    .leftJoin("Projects as p", "a.projectId", "p.id")
    .leftJoin(
      "UniversityPointsOfContact as poc",
      "a.universityPointOfContactId",
      "poc.id"
    )
    .selectAll("a")
    .select([
      "u.name as universityName",
      "poc.fullName as pocName",
      "p.name as projectName",
      "p.ownerId",
      "m.preferredName as mentorPreferredName",
      "m.lastName as mentorLastName",
    ])
    .where("a.id", "=", Number(id))
    .executeTakeFirstOrThrow();

  const projectMembers = await db
    .selectFrom("ProjectMembers")
    .select(["profileId"])
    .where("projectId", "=", applicant.projectId)
    .execute();

  return { ...applicant, projectMembers };
}

export async function editApplicant(
  data: UpdateObjectExpression<DB, "Applicant", "Applicant">,
  id: number
) {
  // eslint-disable-next-line no-console
  return await db
    .updateTable("Applicant")
    .where("id", "=", id)
    .set(data)
    .returning(["id", "status"])
    .executeTakeFirstOrThrow();
}
