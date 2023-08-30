import { prisma as db } from "~/db.server";

/*
export async function createForm(FormData: any, mentorId: string) {
  const result = await db.applicant.create({
    data: {
      email: FormData.email,
      personalEmail: FormData.personalEmail,
      fullName: FormData.fullName,
      nationality: FormData.nationality,
      country: FormData.country,
      dayOfBirth: FormData.dayOfBirth,
      homeAddress: FormData.homeAddress,
      phone: FormData.phone,
      universityEmail: FormData.universityEmail,
      emergencyContactName: FormData.emergencyContactName,
      emergencyContactPhone: FormData.emergencyContactPhone,
      emergencyRelationship: FormData.emergencyRelationship,
      gender: FormData.gender,
      englishLevel: FormData.englishLevel,
      university: FormData.university,
      campus: FormData.campus,
      major: FormData.major,
      semester: FormData.semester,
      graduationDate: FormData.graduationDate,
      interest: FormData.interest,
      experience: FormData.experience,
      cvLink: FormData.cvLink,
      interestedRoles: FormData.interestedRoles,
      preferredTools: FormData.preferredTools,
      startDate: FormData.startDate,
      endDate: FormData.endDate,
      hoursPerWeek: FormData.hoursPerWeek,
      howDidYouHearAboutUs: FormData.howDidYouHearAboutUs,  
      participatedAtWizeline: FormData.participatedAtWizeline,
      wizelinePrograms: FormData.wizelinePrograms,
      comments: FormData.comments,
      mentor: { connect: { id: mentorId } },
      //project: { connect: {id: projectId} },
    },
  });
  return result;
}
*/

export async function createForm (
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
  university: string,
  campus: string,
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
  mentorId: string,) {
  const result = await db.applicant.create({
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
      university: university,
      campus: campus,
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
      mentor: { connect: { id: mentorId } },
    },
  });
  return result;
}


export async function searchApplicants() {
  return await db.applicant.findMany({
    where : {
      startDate: {
        gte: new Date(Date.now() - 60 * 60 * 24 * 30 * 3 /** months **/ * 1000).toISOString()
      }
    }
  });
}

export async function getApplicantById(id: any) {
  return await db.applicant.findUnique({
    where: { 
      id: parseInt(id)
    },
    include: {
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

export async function editApplicant(data:any, id:number) {
  // eslint-disable-next-line no-console
  console.log('test edit');
  return await db.applicant.update({ data , where: { id }});
}
