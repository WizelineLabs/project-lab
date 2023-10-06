
-- CreateTable
CREATE TABLE "internsComments" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "authorId" TEXT NOT NULL,
    "applicantId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "parentId" TEXT,

    CONSTRAINT "internsComments_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "internsComments" ADD CONSTRAINT "internsComments_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "Profiles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internsComments" ADD CONSTRAINT "internsComments_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "internsComments"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "internsComments" ADD CONSTRAINT "internsComments_applicantId_fkey" FOREIGN KEY ("applicantId") REFERENCES "Applicant"("id") ON DELETE CASCADE ON UPDATE CASCADE;
