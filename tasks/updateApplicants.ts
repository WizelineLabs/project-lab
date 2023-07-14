import fs from "fs";
import csv from "csv-parser";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const csvFileName = process.argv[2];

fs.createReadStream(csvFileName)
  .pipe(csv())
  .on("data", async (row: any) => {
    const data = {
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
      university: row["University or organization you belong to"] as string,
      campus: row["Campus, if applicable"] as string,
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
      comments: row["Any comments?"] as string,
    };
    try {
      await prisma.applicant.upsert({
        where: { email: row["Email Address"] as string },
        create: data,
        update: data,
      });
    } catch (e) {
      console.log(data);
      console.log(e);
    }
  })
  .on("end", () => {
    console.log("CSV file successfully processed");
    //prisma.$disconnect();
  });
