import type {
  User,
  Profiles,
  GitHubProfile,
  GitHubProjects,
  PrismaClient,
} from "@prisma/client";
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
    where: { email }
  });
}

export async function getFullProfileByEmail(email: Profiles["email"]) {
  return prisma.profiles.findUnique({
    where: { email },
    include: {
      projectMembers: {
        include: {
          project: true,
          role: true,
          practicedSkills: true,
        }
      }
    }
  });
}

export async function getGitHubProfileByEmail(email: GitHubProfile["email"]) {
  const profile = await prisma.gitHubProfile.findUnique({
    where: { email },
  });

  return profile;
}

export async function getGitHubProjectsByEmail(
  email: GitHubProjects["owner_email"]
) {
  const projects = await prisma.gitHubProjects.findMany({
    where: { owner_email: email },
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
    githubUser: data.githubUser,
  };

  return prisma.profiles.update({ where: { id }, data: data });
}

export async function createGitHubProfile(
  email: string,
  username: string,
  avatarUrl: string,
  reposUrl: string,
  firstName: string,
  lastName: string
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
  owner_email: string,
  name: string,
  description: string,
  updated_at: string
) {
  return prisma.gitHubProjects.create({
    data: {
      owner_email: owner_email,
      name: name,
      description: description,
      updated_at: updated_at,
    },
  });
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

  try {
    await prisma.$transaction(async (tx) => {
      data.forEach(async (profile) => {
        try {
          await db.profiles.upsert({
            where: { email: profile.email },
            update: {
              ...profile,
            },
            create: {
              ...profile,
            },
          });
        } catch (e) {
          // eslint-disable-next-line no-console
          console.log(e, profile);
        }
      });
      // eslint-disable-next-line no-console
      console.info(`Terminate users not found on data lake from DB`);
      const result = await db.profiles.updateMany({
        data: {
          employeeStatus: 'Terminated'
        },
        where: {
          email: {
            notIn: profileMails
          }
        }
      })
      // eslint-disable-next-line no-console
      console.info(`${result.count} affected profiles`);
    });
  } catch (e) {
    // eslint-disable-next-line no-console
    console.log(e);
  }
}

function unaccent(text: string) {
  return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "")
}

interface SearchProfilesFullInput {
  searchTerm: string
  page: number
  department?: string[]
  businessUnit?: string[]
  benchStatus?: string[]
  employeeStatus?: string[]
  skill?: string[]
  itemsPerPage: number
}

interface FacetOutput {
  name: string;
  count: number;
}

type whereClause = {
  [key: string]: any;
}
export async function searchProfilesFull({
  searchTerm,
  page = 1,
  department = [],
  businessUnit = [],
  benchStatus = [],
  employeeStatus = [],
  skill = [],
  itemsPerPage = 50,
}: SearchProfilesFullInput) {
  if (page < 1) page = 1
  let where: whereClause = {
    searchCol: {
      contains: unaccent(searchTerm)
    }
  }

  if (department.length > 0) {
    where = {
      ...where,
      department: { in: department }
    }
  }

  if (businessUnit.length > 0) {
    where = {
      ...where,
      businessUnit: { in: businessUnit }
    }
  }

  if (benchStatus.length > 0) {
    where = {
      ...where,
      benchStatus: { in: benchStatus }
    }
  }

  if (employeeStatus.length > 0) {
    where = {
      ...where,
      employeeStatus: { in: employeeStatus }
    }
  }

  if (skill.length > 0) {
    where = {
      ...where,
      projectMembers: {
        some: {
          practicedSkills: {
            some: {
              name: {
                in: skill
              }
            }
          }
        }
      }
    }
  }

  // Get ids
  const profileIds = await prisma.profiles.findMany({
    select: {
      id: true
    },
    where
  })

  const ids = profileIds.map(id => id.id)
  const count = ids.length;

  // final query
  const profiles = await prisma.profiles.findMany({
    select: {
      id: true,
      email: true,
      firstName: true,
      lastName: true,
      avatarUrl: true,
      jobLevelTier: true,
      jobLevelTitle: true,
      department: true,
      createdAt: true,
      updatedAt: true,
      country: true,
      location: true,
      preferredName: true,
      benchStatus: true,
      businessUnit: true,
      employeeStatus: true,
      githubUser: true,
      projectMembers: {
        select: {
          project: {
            select: { id: true, name: true }
          },
          role: {
            select: { name: true }
          },
          practicedSkills: {
            select: { name: true }
          }
        }
      }
    },
    take: itemsPerPage,
    skip: (page - 1) * itemsPerPage,
    where: {
      id: {
        in: ids
      }
    },
    orderBy: [
      { lastName: 'asc' },
      { firstName: 'asc' }
    ]
  })

  const departments = await prisma.profiles.groupBy({
    by: ['department'],
    where: {
      id: {
        in: ids
      },
      department: {
        not: null
      }
    },
    orderBy: {
      department: 'asc'
    },
    _count: {
      department: true
    }
  })

  const businessUnits = await prisma.profiles.groupBy({
    by: ['businessUnit'],
    where: {
      id: {
        in: ids
      },
      businessUnit: {
        not: null
      }
    },
    orderBy: {
      businessUnit: 'asc'
    },
    _count: {
      businessUnit: true
    }
  })

  const employeeStatuses = await prisma.profiles.groupBy({
    by: ['employeeStatus'],
    where: {
      id: {
        in: ids
      },
      employeeStatus: {
        not: null
      }
    },
    orderBy: {
      employeeStatus: 'asc'
    },
    _count: {
      employeeStatus: true
    }
  })

  const benchStatuses = await prisma.profiles.groupBy({
    by: ['benchStatus'],
    where: {
      id: {
        in: ids
      },
      benchStatus: {
        not: null
      }
    },
    orderBy: {
      benchStatus: 'asc'
    },
    _count: {
      benchStatus: true
    }
  })

  const profileIdsWhereSql = Prisma.sql`pm."profileId" IN (${Prisma.join(ids)})`;

  const skills = await prisma.$queryRaw<FacetOutput[]>`
    SELECT s.name, count(DISTINCT pm."profileId") as count
    FROM "Skills" s
    LEFT JOIN "_ProjectMembersToSkills" pmts ON pmts."B" = S.id
    LEFT JOIN "ProjectMembers" pm on pmts."A" = pm.id 
    WHERE ${profileIdsWhereSql} AND s.name NOT IN (${skill.length > 0 ? Prisma.join(skill) : ""
    })
    AND s.name IS NOT NULL
    GROUP BY s.name
    ORDER BY count DESC
  `;

  // Filter out invalid avatar urls
  profiles.forEach(profile => {
    if (profile.avatarUrl?.length && !profile.avatarUrl?.startsWith("https://")) {
      profile.avatarUrl = null
    }
  })

  return {
    profiles,
    count,
    departments: convertCountResult(departments, "department"),
    businessUnits: convertCountResult(businessUnits, "businessUnit"),
    employeeStatuses: convertCountResult(employeeStatuses, "employeeStatus"),
    benchStatuses: convertCountResult(benchStatuses, "benchStatus"),
    skills
  }
}

const convertCountResult = (countResult: any[], countField: string) => {
  return countResult.map(item => {
    return {
      name: item[countField],
      count: item._count[countField]
    }
  })
}

export async function searchProfiles(
  searchTerm: string,
  project: string | null = null
) {
  const select = Prisma.sql`
    SELECT "Profiles".id, "preferredName" || ' ' || "lastName" || ' <' || "email" || '>' as name
    FROM "Profiles"
  `;
  const orderBy = Prisma.sql`
    ORDER BY "preferredName", "lastName"
    LIMIT 50;
  `;
  // where condition
  let where = Prisma.sql``;
  if (searchTerm && searchTerm !== "") {
    const prefixSearch = `%${searchTerm}%`;
    where = Prisma.sql`WHERE "searchCol" like lower(unaccent(${prefixSearch}))`;
  }

  //project condition
  let projectJoin = Prisma.sql``;
  let projectWhere = Prisma.sql``;
  if (project) {
    projectJoin = Prisma.sql`INNER JOIN "ProjectMembers" pm ON "Profiles".id = pm."profileId"`;
    projectWhere = Prisma.sql`WHERE pm."projectId" = ${project}`;
    if (searchTerm && searchTerm !== "") {
      projectWhere = Prisma.sql`AND pm."projectId" = ${project}`;
    }
  }

  // final query
  let result = await prisma.$queryRaw`
    ${select}
    ${projectJoin}
    ${where}
    ${projectWhere}
    ${orderBy}
  `;

  return result;
}

export async function hasProject(profileId: string) {
  const searchTemMember = await prisma.projectMembers.findFirst({
    where: { profileId },
  });

  return searchTemMember ? true : false;
}
