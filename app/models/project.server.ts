import { prisma, Profiles, Projects } from "@prisma/client";
import { Prisma } from "@prisma/client"

import { joinCondition, prisma as db } from "~/db.server";

interface SearchProjectsInput {
  profileId: Profiles["id"]
  search: string | string[]
  status: string[]
  skill: string[]
  discipline: string[]
  tier: string[]
  location: string[]
  label: string[]
  role: string[]
  missing: string[]
  skip: number
  take: number
  orderBy: { field: string; order: string }
}

interface SearchProjectsOutput {
  id: string
  name: string
  createdAt: string
  updatedAt: string
  description: string
  firstName: string
  lastName: string
  avatarUrl: string
  status: string
  color: string
  searchSkills: string
  votesCount: string
  projectMembers: string
  owner: string
  tierName: string
}

interface ProjectWhereInput {
  status?: string | null
  tierName?: string | null
}

interface SearchIdsOutput {
  id: string
}

interface FacetOutput {
  name: string
  count: number
}

export class SearchProjectsError extends Error {
  name = "SearchProjectsError"
  message = "There was an error while searching for projects."
}

export function isProjectTeamMember(profileId: string, project: ProjectComplete) {
  const isProjectMember = project?.projectMembers.some((p) => p.profileId === profileId);
  const isProjectOwner = profileId === project?.ownerId;
  return isProjectMember || isProjectOwner;
}

export function getProjectTeamMember(profileId: string, project: ProjectComplete) {
  return project?.projectMembers.find(p => p.profileId === profileId);
}

export async function getProject({
  id
}: Pick<Projects, "id">) {
  return await db.projects.findFirst({
    where: { id },
    include: {
      skills: true,
      disciplines: true,
      labels: true,
      projectStatus: true,
      owner: true,
      projectMembers: {
        include: {
          profile: { select: { firstName: true, lastName: true, email: true } },
          contributorPath: true,
          practicedSkills: true,
          role: true,
        },
        orderBy: [{ active: "desc" }],
      },
      stages: {
        include: {
          projectTasks: true,
        },
        orderBy: [{ position: "asc" }],
      },
      votes: { where: { projectId: id } },
      innovationTiers: true,
      repoUrls: true,
    },
  })
}

export type ProjectComplete = Prisma.PromiseReturnType<typeof getProject>

export async function getProjects(where: ProjectWhereInput) {
  try {
    const projects = await db.projects.findMany({
      where,
      include: {
        projectStatus: true,
        owner: true,
        skills: true,
        projectMembers: true,
      },
    })
    return projects
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

export async function updateProjects({
  ids,
  data,
}: {
  ids: string[];
  data: ProjectWhereInput;
}) {
  await db.projects.updateMany({
    where: { id: { in: ids } },
    data,
  })
}

export async function searchProjects({
  profileId,
  search,
  status,
  skill,
  discipline,
  label,
  tier,
  location,
  role,
  missing,
  orderBy,
  skip = 0,
  take = 50,
}: SearchProjectsInput) {
  let where = Prisma.sql`WHERE p.id IS NOT NULL`;
  let having = Prisma.empty;
  if (search && search !== "") {
    search === "myProposals"
      ? (where = Prisma.sql`WHERE pm."profileId" = ${profileId}`)
      : (where = Prisma.sql`WHERE "tsColumn" @@ websearch_to_tsquery('english', ${search})`);
  }

  if (status.length > 0) {
    where = Prisma.sql`${where} AND p.status IN (${Prisma.join(status)})`
  }

  if (skill.length > 0) {
    where = Prisma.sql`${where} AND "Skills".name IN (${Prisma.join(skill)})`
    having = joinCondition(having, Prisma.sql`COUNT(DISTINCT "Skills".name) = ${skill.length}`)
  }

  if (discipline.length > 0) {
    where = Prisma.sql`${where} AND "Disciplines".name IN (${Prisma.join(discipline)})`
    having = joinCondition(having, Prisma.sql`COUNT(DISTINCT "Disciplines".name) = ${discipline.length}`)
  }

  if (tier.length > 0) {
    where = Prisma.sql`${where} AND "tierName" IN (${Prisma.join(tier)})`
    having = joinCondition(having, Prisma.sql`COUNT(DISTINCT "tierName") = ${tier.length}`)
  }

  if (label.length > 0) {
    where = Prisma.sql`${where} AND "Labels".name IN (${Prisma.join(label)})`
    having = joinCondition(having, Prisma.sql`COUNT(DISTINCT "Labels".name) = ${label.length}`)
  }

  if (location.length > 0) {
    where = Prisma.sql`${where} AND loc.name IN (${Prisma.join(location)})`
    having = joinCondition(having, Prisma.sql`COUNT(DISTINCT loc.name) = ${location.length}`)
  }

  // TODO: instead imlement a function to join with AND or not depending on if empty
  if (role.length > 0) {
    where = Prisma.sql`${where} AND roles.name IN (${Prisma.join(role)}) AND pm.active = true`
    having = joinCondition(having, Prisma.sql`COUNT(DISTINCT roles.name) = ${role.length}`)
  }

  if (missing.length > 0) {
    where = Prisma.sql`${where} AND p.id NOT IN (
      SELECT pm."projectId"
      FROM "Disciplines" d
      INNER JOIN "_DisciplinesToProjectMembers" _dpm ON _dpm."A" = d.id
      INNER JOIN "ProjectMembers" pm ON pm.id = _dpm."B" AND pm.active = true
      WHERE d.name IN (${Prisma.join(missing)})
    )`
  }

  let orderQuery = Prisma.sql`ORDER BY "tierName" ASC`
  if (orderBy.field == "updatedAt") {
    orderQuery = Prisma.sql`ORDER BY p."updatedAt" DESC`
  } else if (orderBy.field == "votesCount") {
    orderQuery = Prisma.sql`ORDER BY "votesCount" DESC`
  } else if (orderBy.field == "projectMembers") {
    orderQuery = Prisma.sql`ORDER BY "projectMembers" DESC`
  } else if (orderBy.field == "mostRecent") {
    orderQuery = Prisma.sql`ORDER BY p."createdAt" DESC`
  }

  if (having != Prisma.empty) {
    having = Prisma.sql`HAVING ${having}`
  }

  const ids = await db.$queryRaw<SearchIdsOutput[]>`
    SELECT DISTINCT p.id
    FROM "Projects" p
    INNER JOIN "ProjectStatus" s on s.name = p.status
    INNER JOIN "Profiles" pr on pr.id = p."ownerId"
    INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
    LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
    LEFT JOIN "Vote" v on v."projectId" = p.id
    LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
    LEFT JOIN "Skills" ON _ps."B" = "Skills".id
    LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
    LEFT JOIN "Labels" ON _lp."A" = "Labels".id
    LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
    LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
    LEFT JOIN "_DisciplinesToProjectMembers" _dpm ON _dpm."B" = pm.id
    LEFT JOIN "Disciplines" as roles ON _dpm."A" = roles.id
    ${where}
    GROUP BY p.id
    ${having};
  `

  let projectIdsWhere = Prisma.sql`false`
  if (ids.length > 0) {
    projectIdsWhere = Prisma.sql`p.id IN (${Prisma.join(ids.map((val) => val.id))})`
  }

  const projects = await db.$queryRaw<SearchProjectsOutput[]>`
    SELECT p.id, p.name, p.description, p."searchSkills", pr."firstName", pr."lastName", pr."avatarUrl", p.status, count(distinct v."profileId") AS "votesCount", s.color,
      p."createdAt",
      p."updatedAt",
      p."ownerId",
      p."tierName",
    COUNT(DISTINCT pm."profileId") as "projectMembers"
    FROM "Projects" p
    INNER JOIN "ProjectStatus" s on s.name = p.status
    INNER JOIN "Profiles" pr on pr.id = p."ownerId"
    INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
    LEFT JOIN "Vote" v on v."projectId" = p.id
    WHERE ${projectIdsWhere}
    GROUP BY p.id, pr.id, s.name
    ${orderQuery}
    LIMIT ${take} OFFSET ${skip};
  `

  const statusFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT p.status as name, COUNT(DISTINCT p.id) as count
    FROM "Projects" p
    WHERE ${projectIdsWhere} AND p.status NOT IN (${
    status.length > 0 ? Prisma.join(status) : ""
  })
    GROUP BY p.status
    ORDER BY count DESC;`

  const skillFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT "Skills".name, "Skills".id, count(DISTINCT p.id) as count
    FROM "Projects" p
    LEFT JOIN "_ProjectsToSkills" _ps ON _ps."A" = p.id
    LEFT JOIN "Skills" ON _ps."B" = "Skills".id
    WHERE ${projectIdsWhere} AND "Skills".name NOT IN (${
    skill.length > 0 ? Prisma.join(skill) : ""
  })
    AND "Skills".name IS NOT NULL
    AND "Skills".id IS NOT NULL
    GROUP BY "Skills".id
    ORDER BY count DESC
  `

  const disciplineFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT "Disciplines".name, "Disciplines".id, count(DISTINCT p.id) as count
    FROM "Projects" p
    LEFT JOIN "_DisciplinesToProjects" _dp ON _dp."B" = p.id
    LEFT JOIN "Disciplines" ON _dp."A" = "Disciplines".id
    WHERE ${projectIdsWhere} AND "Disciplines".name NOT IN (${
    discipline.length > 0 ? Prisma.join(discipline) : ""
  })
    AND "Disciplines".name IS NOT NULL
    AND "Disciplines".id IS NOT NULL
    GROUP BY "Disciplines".id
    ORDER BY count DESC
  `

  const labelFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT "Labels".name, "Labels".id, count(DISTINCT p.id) as count
    FROM "Projects" p
    LEFT JOIN "_LabelsToProjects" _lp ON _lp."B" = p.id
    LEFT JOIN "Labels" ON _lp."A" = "Labels".id
    WHERE ${projectIdsWhere} AND "Labels".name NOT IN (${
    label.length > 0 ? Prisma.join(label) : ""
  })
    AND "Labels".name IS NOT NULL
    AND "Labels".id IS NOT NULL
    GROUP BY "Labels".id
    ORDER BY count DESC
  `

  const tierFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT p."tierName" as name, COUNT(DISTINCT p.id) as count
    FROM "Projects" p
    WHERE ${projectIdsWhere} AND p."tierName" NOT IN (${
    tier.length > 0 ? Prisma.join(tier) : ""
  })
    GROUP BY p."tierName"
    ORDER BY count DESC, p."tierName"
  `

  const locationsFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT loc.name, loc.id, count(DISTINCT p.id) as count
    FROM "Projects" p
    INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
    INNER JOIN "Profiles" pr on pr.id = p."ownerId"
    LEFT JOIN "Locations" loc ON loc.id = pr."locationId"
    WHERE ${projectIdsWhere} AND loc.name NOT IN (${
    location.length > 0 ? Prisma.join(location) : ""
  })
    AND loc.name IS NOT NULL
    AND loc.id IS NOT NULL
    GROUP BY loc.id
    ORDER BY count DESC
  `

  const roleFacets = await db.$queryRaw<FacetOutput[]>`
    SELECT d.name, d.id, count(DISTINCT p.id) as count
    FROM "Disciplines" d
    LEFT JOIN "_DisciplinesToProjectMembers" _dpm ON _dpm."A" = d.id
    LEFT JOIN "ProjectMembers" pm ON pm.id = _dpm."B" AND pm.active = true
    LEFT JOIN "Projects" p ON p.id = pm."projectId" AND ${projectIdsWhere}
    GROUP BY d.id
    ORDER BY LOWER(d.name) ASC
  `

  const hasMore = skip + take < ids.length
  const nextPage = hasMore ? { take, skip: skip + take } : null

  return {
    projects,
    nextPage,
    hasMore,
    count: ids.length,
    statusFacets,
    skillFacets,
    labelFacets,
    disciplineFacets,
    tierFacets,
    locationsFacets,
    roleFacets: roleFacets.filter((val) => val.count != 0 && role.indexOf(val.name) == -1),
    missingFacets: roleFacets.filter(
      (val) => val.count != ids.length && missing.indexOf(val.name) == -1
    ),
  };
}
/*
export async function createPost(post) {
  return prisma.post.create({data:post})
}
*/