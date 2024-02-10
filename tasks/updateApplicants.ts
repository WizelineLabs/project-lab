import { Prisma, PrismaClient } from "@prisma/client";
import csv from "csv-parser";
import fs from "fs";

const prisma = new PrismaClient();

const csvFileName = process.argv[2];
const applicants: any[] = [];
fs.createReadStream(csvFileName)
  .pipe(csv())
  .on("data", async (row: any) => {
    const applicant: any = {
      createdAt: new Date(row.Timestamp),
      email: row["Email Address"] as string,
      personalEmail: row["Personal Email"] as string,
      fullName: row["Full Name"] as string,
      nationality: row["Nationality"] as string,
      country: row["Country of residence"] as string,
      dayOfBirth: new Date(row["Date of birth"]),
      homeAddress: row["Home address"] as string,
      phone: row["Phone number"] as string,
      universityEmail: row["Organization or University Email"] as string,
      emergencyContactName: row[
        "Name of contact in case of emergency"
      ] as string,
      emergencyRelationship: row["Relationship"] as string,
      gender: row["I identify as:"] as string,
      englishLevel: row["English Level"] as string,
      university: {
        connect: {
          name: row[
            "University or organization you belong to"
          ].trim() as string,
        },
      },
      // universityPointOfContact is not found in csv so we skip it
      major: row["Degree and field you are studying"] as string,
      semester: row[
        "Semester or period you will be studying while this program runs"
      ] as string,
      graduationDate: new Date(row["Approximate graduation date"]),
      interest: row[
        "Describe why you are interested in applying for a program at Wizeline"
      ] as string,
      experience: row[
        "Do you have any supporting skills or certifications that would support your application (i.e. IT training courses?)"
      ] as string,
      cvLink: row["Link to your CV or LinkedIn profile"] as string,
      preferredTools: row[
        "Preferred tools, programs, frameworks, programming languages, or libraries"
      ] as string,
      startDate: new Date(
        row["If accepted, the preferred start date for the internship program."]
      ),
      endDate: new Date(
        row["If accepted, the preferred end date for the internship program."]
      ),
      hoursPerWeek: parseInt(row["How many hours a week could you provide?"]),
      howDidYouHearAboutUs: row[
        "How did you hear about this program?"
      ] as string,
      participatedAtWizeline:
        row["Have you participated in any program at Wizeline before?"] ==
        "Yes",
      wizelinePrograms: row["Which Wizeline program?"] as string,
      interestedRoles: row["Roles I'm more interested in growing"] as string,
      comments: row["Any comments?"],
    };
    applicants.push(applicant);
  })
  .on("end", async () => {
    console.log("CSV file successfully processed");

    insertApplicants(applicants);
  });

function insertApplicants(applicants: any[]) {
  applicants.forEach(async (applicant) => {
    const university = applicant.university.connect.name;
    await upsertUniversity(university);
    await upsertApplicant(applicant);
  });
}

async function upsertUniversity(university: string) {
  await prisma.$transaction(async (tx) => {
    await tx.universities
      .upsert({
        where: {
          name: university,
        },
        create: {
          name: university,
        },
        update: {},
      })
      .then((a: any) => console.log("Upserted university :" + a.name))
      .catch(async (e: any) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code == "P2002"
        ) {
          // Retry
          /* See https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#unique-key-constraint-errors-on-upserts */
          console.warn(
            "Failed university upsert: " + university + ". CODE P2002. RETRYING"
          );
          await upsertUniversity(university);
        } else {
          console.error(">> FAIED UNIVERSITY UPSERT: " + university);
          console.error(e);
        }
      });
  });
}

async function upsertApplicant(applicant: any) {
  // CREATE APPLICANT
  await prisma.$transaction(async (tx) => {
    await tx.applicant
      .upsert({
        where: {
          email: applicant.email,
        },
        create: applicant,
        update: {},
        select: {
          fullName: true,
        },
      })
      .then((a: any) => console.log("Upserted applicant :" + a.fullName))
      .catch(async (e: any) => {
        if (
          e instanceof Prisma.PrismaClientKnownRequestError &&
          e.code == "P2002"
        ) {
          // Retry
          /* See https://www.prisma.io/docs/reference/api-reference/prisma-client-reference#unique-key-constraint-errors-on-upserts */
          console.warn(
            "Failed applicant upsert: " +
              applicant.fullName +
              ". CODE P2002. RETRYING"
          );
          await upsertApplicant(applicant);
        } else {
          console.error(">> FAIED APPLICANT UPSERT: " + applicant.fullName);
          console.error(e);
        }
      });
  });
}
