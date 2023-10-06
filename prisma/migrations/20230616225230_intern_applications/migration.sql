
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
    "status" TEXT NOT NULL DEFAULT 'DRAFT',
    "mentorId" TEXT,
    "projectId" TEXT,

    CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_mentorId_fkey" FOREIGN KEY ("mentorId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Applicant" ADD CONSTRAINT "Applicant_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;

--- CreateIndex
CREATE UNIQUE INDEX "Applicant_email_key" ON "Applicant"("email");

-- CreateIndex
CREATE INDEX "applicant_status_idx" ON "Applicant"("status");

-- AlterTable
ALTER TABLE "Profiles" ALTER COLUMN "preferredName" SET NOT NULL;
