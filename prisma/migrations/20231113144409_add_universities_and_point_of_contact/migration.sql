-- CreateTable
CREATE TABLE "Universities" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Universities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UniversityPointsOfContact" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "universityId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UniversityPointsOfContact_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Universities_name_key" ON "Universities"("name");

-- AddForeignKey
ALTER TABLE "UniversityPointsOfContact" ADD CONSTRAINT "UniversityPointsOfContact_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "Universities"("id") ON DELETE CASCADE ON UPDATE CASCADE;
