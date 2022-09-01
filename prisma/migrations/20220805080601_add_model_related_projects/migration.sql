-- CreateTable
CREATE TABLE "RelatedProjects" (
    "id" SERIAL NOT NULL,
    "projectAId" TEXT NOT NULL,
    "projectBId" TEXT NOT NULL,

    CONSTRAINT "RelatedProjects_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RelatedProjects_projectAId_projectBId_key" ON "RelatedProjects"("projectAId", "projectBId");

-- AddForeignKey
ALTER TABLE "RelatedProjects" ADD CONSTRAINT "RelatedProjects_projectAId_fkey" FOREIGN KEY ("projectAId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RelatedProjects" ADD CONSTRAINT "RelatedProjects_projectBId_fkey" FOREIGN KEY ("projectBId") REFERENCES "Projects"("id") ON DELETE CASCADE ON UPDATE CASCADE;
