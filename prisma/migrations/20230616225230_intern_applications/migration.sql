
-- CreateTable
CREATE TABLE "Applicant" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "email" TEXT NOT NULL,
    "personalEmail" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "nationality" TEXT NOT NULL,
    "country" TEXT NOT NULL,
    "dayOfBirth" TIMESTAMP(3) NOT NULL,
    "homeAddress" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "universityEmail" TEXT,
    "emergencyContactName" TEXT,
    "emergencyContactPhone" TEXT,
    "emergencyRelationship" TEXT,
    "gender" TEXT NOT NULL,
    "englishLevel" TEXT NOT NULL,
    "university" TEXT NOT NULL,
    "campus" TEXT,
    "major" TEXT NOT NULL,
    "semester" TEXT NOT NULL,
    "graduationDate" TIMESTAMP(3) NOT NULL,
    "interest" TEXT NOT NULL,
    "experience" TEXT NOT NULL,
    "cvLink" TEXT NOT NULL,
    "interestedRoles" TEXT,
    "preferredTools" TEXT,
    "startDate" TIMESTAMP(3) NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "hoursPerWeek" INTEGER NOT NULL,
    "howDidYouHearAboutUs" TEXT NOT NULL,
    "participatedAtWizeline" BOOLEAN NOT NULL,
    "wizelinePrograms" TEXT,
    "comments" TEXT,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");
