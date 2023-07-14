-- CreateTable
CREATE TABLE "GitHubProfile" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "avatarUrl" TEXT NOT NULL,
    "reposUrl" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    CONSTRAINT "GitHubProfile_pkey" PRIMARY KEY ("id")
);
-- CreateTable
CREATE TABLE "GitHubProjects" (
    "id" TEXT NOT NULL,
    "owner_email" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "updated_at" TEXT NOT NULL,
    CONSTRAINT "GitHubProjects_pkey" PRIMARY KEY ("id")
);
-- CreateIndex
CREATE UNIQUE INDEX "GitHubProfile_email_key" ON "GitHubProfile"("email");