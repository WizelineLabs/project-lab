import { Prisma } from "@prisma/client";
import { prisma as db } from "~/db.server";

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
  let result = await db.applicant.create({
    data: {
      email: email,
      personalEmail: personalEmail,
      fullName: fullName,
      nationality: nationality,
      country: country,
      dayOfBirth: dayOfBirth,
      homeAddress: homeAddress,
      phone: phone,
      universityEmail: universityEmail,
      emergencyContactName: emergencyContactName,
      emergencyContactPhone: emergencyContactPhone,
      emergencyRelationship: emergencyRelationship,
      gender: gender,
      englishLevel: englishLevel,
      university: {
        connect: {
          id: universityId,
        },
      },
      major: major,
      semester: semester,
      graduationDate: graduationDate,
      interest: interest,
      experience: experience,
      cvLink: cvLink,
      interestedRoles: interestedRoles,
      preferredTools: preferredTools,
      startDate: startDate,
      endDate: endDate,
      hoursPerWeek: hoursPerWeek,
      howDidYouHearAboutUs: howDidYouHearAboutUs,
      participatedAtWizeline: participatedAtWizeline,
      wizelinePrograms: wizelinePrograms,
      comments: comments,
      avatarApplicant: avatarApplicant,
    },
  });
  if (pointOfContactId !== undefined) {
    result = await db.applicant.update({
      where: {
        id: result.id,
      },
      data: {
        universityPointOfContact: {
          connect: {
            id: pointOfContactId,
          },
        },
      },
    });
  }
  return result;
}

export async function addAppliedProject(
  email: string,
  projectName: string,
  projectId: string
) {
  const existingApplicant = await db.applicant.findUnique({
    where: {
      email: email,
    },
  });
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
  await db.applicant.update({
    where: { email: email },
    data: {
      appliedProjects: updatedProjectsString,
      appliedProjectsId: updatedProjectsIdString,
    },
  });
}

export async function getAppliedProjectsByEmail(email: string) {
  const existingApplicant = await db.applicant.findUnique({
    where: {
      email: email,
    },
    select: {
      appliedProjects: true,
    },
  });

  if (!existingApplicant || !existingApplicant.appliedProjects) {
    return [];
  }

  return existingApplicant.appliedProjects.split(",");
}

export async function searchApplicants() {
  return await db.applicant.findMany({
    where: {
      startDate: {
        gte: new Date(
          Date.now() - 60 * 60 * 24 * 30 * 3 /** months **/ * 1000
        ).toISOString(),
      },
    },
    include: {
      university: {
        select: {
          name: true,
        },
      },
      universityPointOfContact: {
        select: {
          fullName: true,
        },
      },
    },
  });
}

export async function getApplicantByEmail(email: string) {
  return await db.applicant.findUnique({
    where: {
      email: email,
    },
    include: {
      university: {
        select: {
          id: true,
          name: true,
        },
      },
      universityPointOfContact: {
        select: {
          id: true,
          fullName: true,
        },
      },
      project: {
        select: {
          name: true,
          ownerId: true,
          projectMembers: {
            select: {
              profileId: true,
            },
          },
        },
      },
      mentor: {
        select: { preferredName: true, lastName: true },
      },
    },
  });
}

export async function existApplicant(email: string) {
  const existingApplicant = await db.applicant.findUnique({
    where: {
      email: email,
    },
  });
  return !!existingApplicant;
}

export async function getApplicantById(id: string) {
  return await db.applicant.findUnique({
    where: {
      id: parseInt(id),
    },
    include: {
      university: {
        select: {
          id: true,
          name: true,
        },
      },
      universityPointOfContact: {
        select: {
          id: true,
          fullName: true,
        },
      },
      project: {
        select: {
          name: true,
          ownerId: true,
          projectMembers: {
            select: {
              profileId: true,
            },
          },
        },
      },
      mentor: {
        select: { preferredName: true, lastName: true },
      },
    },
  });
}

export async function editApplicant(
  data: Prisma.ApplicantUncheckedUpdateInput,
  id: number
) {
  // eslint-disable-next-line no-console
  console.log("test edit");
  return await db.applicant.update({ data, where: { id } });
}
