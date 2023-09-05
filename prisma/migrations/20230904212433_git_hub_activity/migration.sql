-- CreateTable
CREATE TABLE "GitHubActivity" (
    "id" SERIAL NOT NULL,
    "typeEvent" TEXT NOT NULL,
    "created_at" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "avatar_url" TEXT NOT NULL,
    "projectId" TEXT,

    CONSTRAINT "GitHubActivity_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GitHubActivity" ADD CONSTRAINT "GitHubActivity_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
