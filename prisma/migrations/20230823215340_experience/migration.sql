
-- CreateTable
CREATE TABLE "Experience" (
    "id" SERIAL NOT NULL,
    "comentario" TEXT NOT NULL,
    "profileId" TEXT,

    CONSTRAINT "Experience_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Experience" ADD CONSTRAINT "Experience_profileId_fkey" FOREIGN KEY ("profileId") REFERENCES "Profiles"("id") ON DELETE SET NULL ON UPDATE CASCADE;
