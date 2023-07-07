import type { User, Profiles, GitHubProfile, GitHubProjects, PrismaClient } from "@prisma/client";
import { Prisma } from "@prisma/client";
import { prisma } from "../db.server";

interface UserProfile extends Profiles {
  role: string;
  name: string;
  userId: string;
}

export async function getProfileByUserId(id: User["id"]) {
  const result = await prisma.$queryRaw<UserProfile[]>`
    SELECT p.*, u.name, u.role, u.id as userId FROM "Profiles" p
    INNER JOIN "User" u ON u.email = p.email
    WHERE u.id = ${id}
  `;

  if (result.length != 1 || !result[0]) return null;
  else return result[0];
}

export async function getProfileByEmail(email: Profiles["email"]) {
  return prisma.profiles.findUnique({
    where: { email },
  });
}

export async function getGitHubProfileByEmail(email: GitHubProfile["email"]) {
  const profile = await prisma.gitHubProfile.findUnique({
    where: { email },
  });

  return profile;
}

export async function getGitHubProjectsByEmail(email: GitHubProjects["owner_email"]) {
  const projects = await prisma.gitHubProjects.findMany({
    where: { owner_email : email},
  });

  if (!projects) {
    throw new Error("Los proyectos de GitHub no existen");
  }

  return projects;
}

export async function createProfile(data: Prisma.ProfilesCreateInput) {
  return prisma.profiles.create({ data });
}

export async function updateProfile(
  data: Prisma.ProfilesUpdateInput,
  id: string
) {

  data = {
    id: data.id,
    email: data.email,
    firstName: data.firstName,
    preferredName: data.preferredName,
    lastName: data.lastName,
    avatarUrl: data.avatarUrl,
    jobLevelTier: data.jobLevelTier,
    jobLevelTitle: data.jobLevelTitle,
    department: data.department,
    businessUnit: data.businessUnit,
    location: data.location,
    country: data.country,
    employeeStatus: data.employeeStatus,
    benchStatus: data.benchStatus,
    createdAt: data.createdAt,
    updatedAt: data.updatedAt,
    jobTitles: data.jobTitles,
    locations: data.locations,
    comments: data.comments,
    projectMembers: data.projectMembers,
    projectMembersVersions: data.projectMembersVersions,
    projects: data.projects,
    projectsVersions: data.projectsVersions,
    votes: data.votes,
    githubUser: data.githubUser
  }
  
  return prisma.profiles.update({ where: { id }, data: data });
}

export async function createGitHubProfile(
  email: string,
  username: string,
  avatarUrl: string,
  reposUrl: string,
  firstName: string,
  lastName: string,
) {
  const gitHubProfile = await prisma.gitHubProfile.create({  
    data: {
      email,
      username,
      avatarUrl,
      reposUrl,
      firstName,
      lastName,
    },
  });
  return gitHubProfile;
}

export async function createGitHubProject(
  owner_email:string,
  name: string,
  description: string,
  updated_at: string,
) {
  return prisma.gitHubProjects.create({  
    data: {
      owner_email: owner_email,
      name: name,
      description: description, 
      updated_at: updated_at,
    },
  })
}

export async function consolidateProfilesByEmail(
  data: Prisma.ProfilesCreateInput[],
  db: PrismaClient
) {
  // don't do anything if we have no data (avoid Terminating users)
  if (data.length == 0) {
    return;
  }
  const profileMails = data.map((profile) => {
    return profile.email;
  });
  // eslint-disable-next-line no-console
  console.info(`Starting upsert profiles to DB`);

  const profilesUpsert = data.map((profile) => {
    return db.profiles.upsert({
      where: { email: profile.email },
      update: {
        ...profile,
      },
      create: {
        ...profile,
      },
    });
  });
  // eslint-disable-next-line no-console
  console.info(`Terminate users not found on data lake from DB`);
  await db.$transaction([
    db.$queryRaw`UPDATE "Profiles" SET "employeeStatus"='Terminated' WHERE email NOT IN (${Prisma.join(
      profileMails
    )})`,
    ...profilesUpsert,
  ]);
}

export async function searchProfiles(searchTerm: string) {
  const select = Prisma.sql`
    SELECT id, "preferredName" || ' ' || "lastName" || ' <' || "email" || '>' as name
    FROM "Profiles"
  `;
  const orderBy = Prisma.sql`
    ORDER BY "preferredName", "lastName"
    LIMIT 50;
  `;
  let result;
  if (searchTerm && searchTerm !== "") {
    const prefixSearch = `%${searchTerm}%`;
    const where = Prisma.sql`WHERE "searchCol" like lower(unaccent(${prefixSearch}))`;
    result = await prisma.$queryRaw`
      ${select}
      ${where}
      ${orderBy}
    `;
  } else {
    result = await prisma.$queryRaw`
      ${select}
      ${orderBy}
    `;
  }
  return result;
}

export async function hasProject(profileId: string) {
    const searchTemMember = await prisma.projectMembers.findFirst( {
      where: { profileId }
    });

    return searchTemMember ? true : false;
}
