import { validator } from "./applicationForm.$applicantId._index";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import { createApplicant } from "~/models/applicant.server";
import { requireProfile } from "~/session.server";

const parseDate = (dateString: string): Date => {
  const [year, month, day] = dateString.split("-");
  return new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
};

export const action: ActionFunction = async ({ request }) => {
  const result = await validator.validate(await request.formData());
  const profile = await requireProfile(request);

  const email = profile?.email;
  const personalEmail =
    (result?.data?.personalEmail as string) ?? "DefaultPersonalEmailValue";
  const fullName = (result?.data?.fullName as string) ?? "DefaultFullNameValue";
  const nationality =
    (result?.data?.nationality as string) ?? "DefaultNationalityValue";
  const country = (result?.data?.country as string) ?? "DefaultCountryValue";
  const dayOfBirth =
    parseDate(result?.data?.dayOfBirth as unknown as string) ?? new Date();
  const homeAddress =
    (result?.data?.homeAddress as string) ?? "DefaultHomeAddressValue";
  const phone = (result?.data?.phone as string) ?? "DefaultPhoneValue";
  const universityEmail =
    (result?.data?.universityEmail as string) ?? "DefaultUniversityEmailValue";
  const emergencyContactName =
    (result?.data?.emergencyContactName as string) ??
    "DefaultEmergencyContactNameValue";
  const emergencyContactPhone =
    (result?.data?.emergencyContactPhone as string) ??
    "DefaultEmergencyContactPhoneValue";
  const emergencyRelationship =
    (result?.data?.emergencyRelationship as string) ??
    "DefaultEmergencyRelationshipValue";
  const gender = (result?.data?.gender as string) ?? "DefaultGenderValue";
  const englishLevel =
    (result?.data?.englishLevel as string) ?? "DefaultEnglishLevelValue";

  const universityId =
    (result?.data?.university.id as string) ?? "DefaultUniversityValue";
  const pointOfContactId =
    (result?.data?.universityContactId as string) ?? undefined;

  const major = (result?.data?.major as string) ?? "DefaultMajorValue";
  const semester = (result?.data?.semester as string) ?? "DefaultSemesterValue";
  const graduationDate =
    parseDate(result?.data?.graduationDate as unknown as string) ?? new Date();
  const interest = (result?.data?.interest as string) ?? "DefaultInterestValue";
  const experience =
    (result?.data?.experience as string) ?? "DefaultExperienceValue";
  const cvLink = (result?.data?.cvLink as string) ?? "DefaultCvLinkValue";
  const interestedRoles =
    (result?.data?.interestedRoles as string) ?? "DefaultInterestedRolesValue";
  const preferredTools =
    (result?.data?.preferredTools as string) ?? "DefaultPreferredToolsValue";
  const startDate =
    parseDate(result?.data?.startDate as unknown as string) ?? new Date();
  const endDate =
    parseDate(result?.data?.endDate as unknown as string) ?? new Date();
  const hoursPerWeek =
    parseInt(result?.data?.hoursPerWeek as unknown as string) || 0;
  const howDidYouHearAboutUs =
    (result?.data?.howDidYouHearAboutUs as string) ??
    "DefaultHowDidYouHearAboutUsValue";
  const participatedAtWizeline = result?.data?.participatedAtWizeline === "Si";
  const wizelinePrograms =
    (result?.data?.wizelinePrograms as string) ??
    "DefaultWizelineProgramsValue";
  const comments = (result?.data?.comments as string) ?? "DefaultCommentsValue";
  const avatarApplicant = profile?.avatarUrl as string;
  const updatedAt = new Date();


  if (!result) {
    throw new Response("Error", {
      status: 400,
    });
  }

  await createApplicant(
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
    pointOfContactId,
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
    updatedAt
  );

  return redirect("/internshipProjects");
};
