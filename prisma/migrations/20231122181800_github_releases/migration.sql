-- CreateTable
CREATE TABLE "GitHubReleases" (
    "id" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "tagName" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "prerealease" BOOLEAN NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "projectId" TEXT,
    "link" TEXT NOT NULL,

    CONSTRAINT "GitHubReleases_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "GitHubReleases" ADD CONSTRAINT "GitHubReleases_projectId_fkey" FOREIGN KEY ("projectId") REFERENCES "Projects"("id") ON DELETE SET NULL ON UPDATE CASCADE;
