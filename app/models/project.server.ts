import { Prisma } from "@prisma/client";
import { jsonArrayFrom } from "kysely/helpers/postgres";
import { defaultStatus, contributorPath } from "~/constants";
import { db, joinCondition, prisma } from "~/db.server";

interface SearchProjectsInput {
  profileId: string;
  search: string | string[];
  status: string[];
  skill: string[];
  discipline: string[];
  tier: string[];
  location: string[];
  label: string[];
  role: string[];
  resource: string[];
  provider: string[];
  missing: string[];
  skip: number;
  take: number;
  orderBy: { field: string; order: string };
}

interface SearchProjectsOutput {
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  preferredName: string;
  lastName: string;
  avatarUrl: string;
  status: string;
  color: string;
  searchSkills: string;
  votesCount: number;
  projectMembers: number;
  owner: string;
  tierName: string;
  resourcesCount: number;
}

interface InternProjectOutput {
  id: string;
  name: string;
  createdAt: string;
  description: string;
  searchSkills: string;
  updatedAt: string;
  valueStatement: string;
}

interface ProjectWhereInput {
  status?: string | null;
  tierName?: string | null;
}

interface SearchIdsOutput {
  id: string;
}

interface FacetOutput {
  name: string;
  count: number;
}

interface RelatedProjectInput {
  relatedProjects: { id: string }[];
}

interface ProjectListOutput {
  id: string;
  name: string;
}

export class SearchProjectsError extends Error {
  name = "SearchProjectsError";
  message = "There was an error while searching for projects.";
}

export function isProjectTeamMember(
  profileId: string | number,
  project: {
    ownerId?: string | null;
    projectMembers?: { profileId: string }[];
  }
) {
  const isProjectMember = project?.projectMembers?.some(
    (p) => p.profileId === profileId
  );
  const isProjectOwner = profileId === project?.ownerId;
  return isProjectMember || isProjectOwner;
}

export function getProjectTeamMember(
  profileId: string,
  projectMembers: Awaited<ReturnType<typeof getProjectTeamMembers>>
) {
  return projectMembers?.find((p) => p.profileId === profileId);
}

export async function getProjectTeamMembers(projectId: string) {
  return await db
    .selectFrom("ProjectMembers as pm")
    .innerJoin("Profiles as p", "p.id", "pm.profileId")
    .select(["pm.id", "pm.profileId", "pm.active", "pm.hoursPerWeek"])
    .select(["p.preferredName", "p.lastName", "p.email"])
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom("Skills as s")
          .innerJoin("_ProjectMembersToSkills as pms", "pms.B", "s.id")
          .select(["s.id", "s.name"])
          .whereRef("pm.id", "=", "pms.A")
          .orderBy("s.name")
      ).as("practicedSkills"),
      jsonArrayFrom(
        eb
          .selectFrom("Disciplines as d")
          .innerJoin("_DisciplinesToProjectMembers as dpm", "dpm.A", "d.id")
          .select(["d.id", "d.name"])
          .whereRef("pm.id", "=", "dpm.B")
          .orderBy("d.name")
      ).as("role"),
    ])
    .where("pm.projectId", "=", projectId)
    .orderBy("pm.active", "desc")
    .orderBy("p.preferredName", "asc")
    .execute();
}

export async function getProject({ id }: { id: string }) {
  const project = await db
    .selectFrom("Projects as p")
    .selectAll("p")
    .select((eb) => [
      jsonArrayFrom(
        eb
          .selectFrom("Skills as s")
          .innerJoin("_ProjectsToSkills as ps", "ps.B", "s.id")
          .select(["s.id", "s.name"])
          .whereRef("p.id", "=", "ps.A")
          .orderBy("s.name")
      ).as("skills"),
      jsonArrayFrom(
        eb
          .selectFrom("Disciplines as d")
          .innerJoin("_DisciplinesToProjects as dp", "dp.A", "d.id")
          .select(["d.id", "d.name"])
          .whereRef("p.id", "=", "dp.B")
          .orderBy("d.name")
      ).as("disciplines"),
      jsonArrayFrom(
        eb
          .selectFrom("Labels as l")
          .innerJoin("_LabelsToProjects as lp", "lp.A", "l.id")
          .select(["l.id", "l.name"])
          .whereRef("p.id", "=", "lp.B")
          .orderBy("l.name")
      ).as("labels"),
      jsonArrayFrom(
        eb
          .selectFrom("Repos as r")
          .select(["r.id", "r.url"])
          .whereRef("p.id", "=", "r.projectId")
          .orderBy("r.url")
      ).as("repoUrls"),
    ])
    .innerJoin("Profiles as owner", "p.ownerId", "owner.id")
    .leftJoin("Vote as v", "v.projectId", "p.id")
    .select(({ fn }) => [fn.count<number>("v.profileId").as("votesCount")])
    .select(["owner.preferredName", "owner.lastName", "owner.email"])
    .where("p.id", "=", id)
    .groupBy(["p.id", "owner.id"])
    .executeTakeFirstOrThrow();

  const relatedProjects = await db
    .selectFrom("Projects as p")
    .innerJoin("RelatedProjects as rp", "rp.projectAId", "p.id")
    .select(["p.id", "p.name"])
    .where("rp.projectBId", "=", id)
    .execute();

  return { ...project, relatedProjects };
}

export async function createProject(input: any, profileId: string) {
  const defaultTier = await prisma.innovationTiers.findFirst({
    select: { name: true },
    where: { defaultRow: true },
  });

  const { ...formInput } = input;

  const project = await prisma.projects.create({
    data: {
      ...formInput,
      owner: { connect: { id: profileId } },
      projectStatus: {
        connect: { name: input.projectStatus?.name || defaultStatus },
      },
      skills: {
        connect: input.skills,
      },
      disciplines: {
        connect: input.disciplines,
      },
      labels: {
        connect: input.labels,
      },
      repoUrls: {
        create: input.repoUrls,
      },
      innovationTiers: {
        connect: { name: input.innovationTiers?.name || defaultTier?.name },
      },
    },
  });

  for (let i = 0; i < contributorPath?.length; i++) {
    const data = {
      name: contributorPath[i]?.name || "Failed",
      criteria: contributorPath[i]?.criteria || "Failed",
      mission: contributorPath[i]?.mission || "Failed",
    };
    const tasks = contributorPath[i]?.tasks || [];
    const position = i + 1;
    const projectTasks: any = [];

    for (const task of tasks) {
      projectTasks.push({
        description: task?.name,
        position: task?.position,
      });
    }

    await prisma.projectStages.create({
      data: {
        ...data,
        project: { connect: { id: project.id } },
        position: position,
        projectTasks: {
          create: projectTasks,
        },
      },
    });
  }

  await prisma.projectMembers.create({
    data: {
      project: { connect: { id: project.id } },
      profile: {
        connect: { id: profileId },
      },
      role: { connect: { name: "Owner" } },
    },
  });
  return project;
}

export type ProjectComplete = Awaited<ReturnType<typeof getProject>>;
export type ProjectMembers = Awaited<ReturnType<typeof getProjectTeamMembers>>;

export async function getProjects(where: ProjectWhereInput) {
  try {
    const projects = await prisma.projects.findMany({
      where,
      select: { id: true, name: true },
    });
    return projects;
  } catch (e) {
    throw new Error(JSON.stringify(e));
  }
}

export const validateIsTeamMember = (
  profileId: string,
  projectMembers: { profileId: string }[],
  ownerId: string | null
) => {
  //validate if the user have permissions (team member or owner of the project)
  const isProjectMember = projectMembers.some(
    (member) => member.profileId === profileId
  );
  const isProjectOwner = profileId === ownerId;

  if (!isProjectMember && !isProjectOwner) {
    throw new Error("You don't have permission to perform this operation");
  }
};

export async function updateMembers(
  projectId: string,
  projectMembers: {
    id?: string;
    profileId: string;
    hoursPerWeek?: number | null;
    role?: { id: string }[];
    practicedSkills?: { id: string }[];
    active: boolean;
  }[]
) {
  const previousMembers = await prisma.projectMembers.findMany({
    where: { projectId },
    select: { id: true, profileId: true },
  });

  const activeMembers: any = [];

  // Loop Project Members
  for (const projectMember of projectMembers) {
    // Create only the members that don't exist in this project
    const previousMember = previousMembers.find(
      (element) => element.profileId == projectMember.profileId
    );
    if (previousMember !== undefined) {
      activeMembers.push(projectMember.profileId);
      // Just disconnects ALL related practicedSkills and roles, so it can UPDATE just the new selected ones after...
      await prisma.$queryRaw`DELETE FROM "_ProjectMembersToSkills" WHERE "A" = ${previousMember.id}`;
      await prisma.$queryRaw`DELETE FROM "_DisciplinesToProjectMembers" WHERE "B" = ${previousMember.id}`;
      // Makes all the actual updates to the projectMember
      await prisma.projectMembers.update({
        where: { id: previousMember.id },
        data: {
          hoursPerWeek: projectMember.hoursPerWeek,
          role: { connect: projectMember.role },
          active: projectMember.active,
          practicedSkills: { connect: projectMember.practicedSkills },
          updatedAt: new Date(),
        },
        include: {
          practicedSkills: true,
        },
      });
    } else {
      await prisma.projectMembers.create({
        data: {
          project: { connect: { id: projectId } },
          profile: { connect: { id: projectMember.profileId } },
          hoursPerWeek: projectMember.hoursPerWeek,
          role: { connect: projectMember.role },
          practicedSkills: { connect: projectMember.practicedSkills },
        },
      });
    }
  }

  // Delete previous members who are no longer in activeMembers array of ids
  for (const previousMember of previousMembers) {
    if (!activeMembers.includes(previousMember.profileId)) {
      await prisma.projectMembers.deleteMany({
        where: { profileId: previousMember.profileId, projectId },
      });
    }
  }
}

export async function updateMembership(
  projectId: string,
  projectMemberId: string,
  data: {
    active: boolean;
    newOwner?: string | undefined;
  }
) {
  if (data.newOwner) {
    await prisma.projects.update({
      where: { id: projectId },
      data: { ownerId: data.newOwner },
    });
  }
  await prisma.projectMembers.update({
    where: { id: projectMemberId },
    data: { active: data.active },
  });
}

export async function joinProject(
  projectId: string,
  profileId: string,
  data: {
    hoursPerWeek?: number;
    role?: { id: string }[];
    practicedSkills?: { id: string }[];
  }
) {
  const projectMember = await prisma.projectMembers.create({
    data: {
      project: { connect: { id: projectId } },
      profile: { connect: { id: profileId } },
      hoursPerWeek: data.hoursPerWeek,
      practicedSkills: { connect: data.practicedSkills },
      role: { connect: data.role },
    },
  });
  return projectMember;
}

export async function updateProjects(
  id: string,
  data: {
    name: string;
    slackChannel?: string;
    description: string;
    valueStatement?: string;
    helpWanted: boolean;
    owner?: { id: string };
    repoUrls?: { url: string }[];
    projectStatus?: { name: string };
    skills?: { id: string }[];
    disciplines?: { id: string }[];
    labels?: { id: string }[];
    innovationTiers?: { name: string };
  }
) {
  // Unlink repos before linking again
  await prisma.repos.deleteMany({ where: { projectId: id } });

  // Delete from Form values because We already updated the project members.
  const project = await prisma.projects.update({
    where: { id },
    data: {
      ...data,
      updatedAt: new Date(),
      projectStatus: { connect: { name: data.projectStatus?.name } },
      innovationTiers: { connect: { name: data.innovationTiers?.name } },
      owner: { connect: { id: data.owner?.id } },
      skills: {
        set: data.skills,
      },
      disciplines: {
        set: data.disciplines,
      },
      labels: {
        set: data.labels,
      },
      repoUrls: {
        create: data.repoUrls,
      },
    },
    include: {
      projectStatus: true,
      skills: true,
      disciplines: true,
      labels: true,
      repoUrls: true,
      owner: true,
      stages: {
        include: {
          projectTasks: true,
        },
      },
      projectMembers: {
        include: {
          profile: {
            select: { preferredName: true, lastName: true, email: true },
          },
          role: true,
          contributorPath: true,
          practicedSkills: true,
        },
      },
      votes: { where: { profileId: id } },
      innovationTiers: true,
    },
  });

  return project;
}

// update several projects from manager tab
export async function updateManyProjects({
  ids,
  data,
}: {
  ids: string[];
  data: ProjectWhereInput;
}) {
  await prisma.projects.updateMany({
    where: { id: { in: ids } },
    data,
  });
}

// edit only relatedProjects
export async function updateRelatedProjects({
  id,
  data,
}: {
  id: string;
  data: RelatedProjectInput;
}) {
  return await prisma.$transaction(async (tx) => {
    // Create related Projects
    const createResponse = [];
    let response;
    for (const relatedProject of data.relatedProjects) {
      const relationExist = await tx.relatedProjects.count({
        where: {
          OR: [
            {
              projectAId: relatedProject.id,
              projectBId: id,
            },
            {
              projectAId: id,
              projectBId: relatedProject.id,
            },
          ],
        },
      });

      if (relationExist === 0) {
        response = await tx.relatedProjects.create({
          data: {
            projectAId: id,
            projectBId: relatedProject.id,
          },
        });
        if (!response) {
          throw new Error(
            `Error when creating relation for: ${relatedProject.id}`
          );
        }
        createResponse.push(response);
      }
    }

    const relatedProjectsIds = data.relatedProjects.map((e) => e.id);
    // Delete related projects
    const deleteResponse = await tx.relatedProjects.deleteMany({
      where: {
        OR: [
          { projectAId: id, projectBId: { notIn: relatedProjectsIds } },
          { projectAId: { notIn: relatedProjectsIds }, projectBId: id },
        ],
      },
    });
    return { createResponse, deleteResponse };
  });
}

export async function getProjectMembership(profileId: string) {
  const daysToCheck = 30;
  const limitDateAbsence = new Date();
  limitDateAbsence.setDate(limitDateAbsence.getDate() - daysToCheck);
  const queryMembership = await prisma.projectMembers.findMany({
    where: {
      profileId,
      updatedAt: {
        lte: limitDateAbsence,
      },
      active: true,
    },
    include: {
      practicedSkills: true,
      role: true,
      project: {
        select: { name: true },
      },
    },
  });
  return queryMembership;
}

export async function updateProjectActivity(
  projects: {
    id: string;
    profileId: string;
    projectId: string;
    hoursPerWeek?: number;
    role: { id: string }[];
    practicedSkills?: { id: string }[];
    active: boolean;
  }[]
) {
  for (const project of projects) {
    await prisma.projectMembers.update({
      where: { id: project.id as string },
      data: {
        hoursPerWeek: project.hoursPerWeek,
        role: { connect: project.role },
        active: project.active,
        practicedSkills: { connect: project.practicedSkills },
        updatedAt: new Date(),
      },
      include: {
        practicedSkills: true,
      },
    });
  }
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
  resource,
  provider,
}: SearchProjectsInput) {
  let where = Prisma.sql`WHERE p.id IS NOT NULL`;
  let having = Prisma.empty;
  if (search && search !== "") {
    search === "myProposals"
      ? (where = Prisma.sql`WHERE pm."profileId" = ${profileId}`)
      : (where = Prisma.sql`WHERE "tsColumn" @@ websearch_to_tsquery('english', ${search})`);
  }

  if (status.length > 0) {
    where = Prisma.sql`${where} AND p.status IN (${Prisma.join(status)})`;
  }

  if (skill.length > 0) {
    where = Prisma.sql`${where} AND "Skills".name IN (${Prisma.join(skill)})`;
    having = joinCondition(
      having,
      Prisma.sql`COUNT(DISTINCT "Skills".name) = ${skill.length}`
    );
  }

  if (discipline.length > 0) {
    where = Prisma.sql`${where} AND "Disciplines".name IN (${Prisma.join(
      discipline
    )})`;
    having = joinCondition(
      having,
      Prisma.sql`COUNT(DISTINCT "Disciplines".name) = ${discipline.length}`
    );
  }

  if (tier.length > 0) {
    where = Prisma.sql`${where} AND "tierName" IN (${Prisma.join(tier)})`;
    having = joinCondition(
      having,
      Prisma.sql`COUNT(DISTINCT "tierName") = ${tier.length}`
    );
  }

  if (label.length > 0) {
    where = Prisma.sql`${where} AND "Labels".name IN (${Prisma.join(label)})`;
    having = joinCondition(
      having,
      Prisma.sql`COUNT(DISTINCT "Labels".name) = ${label.length}`
    );
  }

  if (location.length > 0) {
    where = Prisma.sql`${where} AND loc.name IN (${Prisma.join(location)})`;
    having = joinCondition(
      having,
      Prisma.sql`COUNT(DISTINCT loc.name) = ${location.length}`
    );
  }

  if (resource.length > 0) {
    if (provider.length > 0) {
      const valuePairs = provider.map((value) => value.split(" | "));
      const providers = valuePairs.map((pair) => pair[1]);
      where = Prisma.sql`${where} AND r.type IN (${Prisma.join(resource)})`;
      where = Prisma.sql`${where} AND r.provider IN (${Prisma.join(
        providers
      )})`;
      having = joinCondition(
        having,
        Prisma.sql`COUNT(DISTINCT r.type) = ${resource.length}`
      );
    } else {
      where = Prisma.sql`${where} AND r.type IN (${Prisma.join(resource)})`;
      having = joinCondition(
        having,
        Prisma.sql`COUNT(DISTINCT r.type) = ${resource.length}`
      );
    }
  }

  // TODO: instead imlement a function to join with AND or not depending on if empty
  if (role.length > 0) {
    where = Prisma.sql`${where} AND roles.name IN (${Prisma.join(
      role
    )}) AND pm.active = true`;
    having = joinCondition(
      having,
      Prisma.sql`COUNT(DISTINCT roles.name) = ${role.length}`
    );
  }

  if (missing.length > 0) {
    where = Prisma.sql`${where} AND p.id NOT IN (
      SELECT pm."projectId"
      FROM "Disciplines" d
      INNER JOIN "_DisciplinesToProjectMembers" _dpm ON _dpm."A" = d.id
      INNER JOIN "ProjectMembers" pm ON pm.id = _dpm."B" AND pm.active = true
      WHERE d.name IN (${Prisma.join(missing)})
    )`;
  }

  let orderQuery;
  if (orderBy.field == "updatedAt") {
    orderQuery = Prisma.sql`ORDER BY p."updatedAt" DESC`;
  } else if (orderBy.field == "votesCount") {
    orderQuery = Prisma.sql`ORDER BY "votesCount" DESC`;
  } else if (orderBy.field == "projectMembers") {
    orderQuery = Prisma.sql`ORDER BY "projectMembers" DESC`;
  } else if (orderBy.field == "mostRecent") {
    orderQuery = Prisma.sql`ORDER BY p."createdAt" DESC`;
  } else {
    orderQuery = Prisma.sql`ORDER BY "hotness" DESC`;
  }

  if (having != Prisma.empty) {
    having = Prisma.sql`HAVING ${having}`;
  }

  const ids = await prisma.$queryRaw<SearchIdsOutput[]>`
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
    LEFT JOIN "Resource" r ON p.id = r."projectId"
    ${where}
    GROUP BY p.id
    ${having};
  `;

  let projectIdsWhere = Prisma.sql`false`;
  if (ids.length > 0) {
    projectIdsWhere = Prisma.sql`p.id IN (${Prisma.join(
      ids.map((val) => val.id)
    )})`;
  }

  const projects = await prisma.$queryRaw<SearchProjectsOutput[]>`
    SELECT p.id, p.name, p.description, p."searchSkills", pr."preferredName", pr."lastName", pr."avatarUrl", p.status, count(distinct v."profileId") AS "votesCount", s.color,
      LOG10(count(distinct v."profileId") + 1) * 287015 + extract(epoch from p."updatedAt") AS "hotness",
      p."createdAt",
      p."updatedAt",
      p."ownerId",
      p."tierName",
    COUNT(DISTINCT pm."profileId") as "projectMembers",
    COUNT(DISTINCT r.id) as "resourcesCount"
    FROM "Projects" p
    INNER JOIN "ProjectStatus" s on s.name = p.status
    INNER JOIN "Profiles" pr on pr.id = p."ownerId"
    INNER JOIN "ProjectMembers" pm ON pm."projectId" = p.id
    LEFT JOIN "Vote" v on v."projectId" = p.id
    LEFT JOIN "Resource" r on r."projectId" = p.id
    WHERE ${projectIdsWhere}
    GROUP BY p.id, pr.id, s.name
    ${orderQuery}
    LIMIT ${take} OFFSET ${skip};
  `;

  const statusFacets = await prisma.$queryRaw<FacetOutput[]>`
    SELECT p.status as name, COUNT(DISTINCT p.id) as count
    FROM "Projects" p
    WHERE ${projectIdsWhere} AND p.status NOT IN (${
    status.length > 0 ? Prisma.join(status) : ""
  })
    GROUP BY p.status
    ORDER BY count DESC;`;

  const skillFacets = await prisma.$queryRaw<FacetOutput[]>`
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
  `;

  const resourceFacets = await prisma.$queryRaw<FacetOutput[]>`
    SELECT DISTINCT r.type as name, count(DISTINCT r.id) as count
    FROM "Projects" p
    LEFT JOIN "Resource" r ON p."id" = r."projectId"
    WHERE ${projectIdsWhere} AND r.type NOT IN (${
    resource.length > 0 ? Prisma.join(resource) : ""
  })
    AND r.type IS NOT NULL
    GROUP BY r.type
    ORDER BY count DESC
  `;

  let providerFacets: FacetOutput[] = [];
  if (resource.length > 0) {
    if (provider.length > 0) {
      const valuePairs = provider.map((value) => value.split(" | "));
      const joined = valuePairs.map((pair) => Prisma.join(pair));
      providerFacets = await prisma.$queryRaw<FacetOutput[]>`
      SELECT r.type || ' | ' || r.provider as name, count(DISTINCT p.id) as count
      FROM "Projects" p
      LEFT JOIN "Resource" r ON p."id" = r."projectId"
      WHERE ${projectIdsWhere} AND (r.type,r.provider) NOT IN (VALUES (${Prisma.join(
        joined,
        "),("
      )})) AND r.type IN (${Prisma.join(resource)})
      AND r.provider IS NOT NULL
      AND r.id IS NOT NULL
      GROUP BY r.type, r.provider
      ORDER BY count DESC
    `;
    } else {
      providerFacets = await prisma.$queryRaw<FacetOutput[]>`
      SELECT r.type || ' | ' || r.provider as name, count(DISTINCT p.id) as count
      FROM "Projects" p
      LEFT JOIN "Resource" r ON p."id" = r."projectId"
      WHERE ${projectIdsWhere} AND r.type IN (${Prisma.join(resource)})
      AND r.provider IS NOT NULL
      AND r.id IS NOT NULL
      GROUP BY r.type, r.provider
      ORDER BY count DESC
    `;
    }
  }

  const disciplineFacets = await prisma.$queryRaw<FacetOutput[]>`
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
  `;

  const labelFacets = await prisma.$queryRaw<FacetOutput[]>`
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
  `;

  const tierFacets = await prisma.$queryRaw<FacetOutput[]>`
    SELECT p."tierName" as name, COUNT(DISTINCT p.id) as count
    FROM "Projects" p
    WHERE ${projectIdsWhere} AND p."tierName" NOT IN (${
    tier.length > 0 ? Prisma.join(tier) : ""
  })
    GROUP BY p."tierName"
    ORDER BY count DESC, p."tierName"
  `;

  const locationsFacets = await prisma.$queryRaw<FacetOutput[]>`
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
  `;

  const roleFacets = await prisma.$queryRaw<FacetOutput[]>`
    SELECT d.name, d.id, count(DISTINCT p.id) as count
    FROM "Disciplines" d
    LEFT JOIN "_DisciplinesToProjectMembers" _dpm ON _dpm."A" = d.id
    LEFT JOIN "ProjectMembers" pm ON pm.id = _dpm."B" AND pm.active = true
    LEFT JOIN "Projects" p ON p.id = pm."projectId" AND ${projectIdsWhere}
    GROUP BY d.id
    ORDER BY LOWER(d.name) ASC
  `;

  const hasMore = skip + take < ids.length;
  const nextPage = hasMore ? { take, skip: skip + take } : null;

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
    resourceFacets,
    providerFacets,
    roleFacets: roleFacets.filter(
      (val) => val.count != 0 && role.indexOf(val.name) == -1
    ),
    missingFacets: roleFacets.filter(
      (val) => val.count != ids.length && missing.indexOf(val.name) == -1
    ),
  };
}

export async function deleteProject(projectId: string, isAdmin: boolean) {
  if (isAdmin) {
    await prisma.projects.delete({ where: { id: projectId } });
  }
  return true;
}

export async function getProjectResources(projectId: string) {
  return prisma.resource.findMany({ where: { projectId } });
}

interface IProjectResource {
  type: string;
  provider: string;
  name: string;
}

export async function updateProjectResources(
  projectId: string,
  resources: IProjectResource[]
) {
  await prisma.resource.deleteMany({ where: { projectId } });
  const data = resources.map((resource) => ({ ...resource, projectId }));
  return prisma.resource.createMany({ data });
}

export async function getProjectsList() {
  return await prisma.$queryRaw<ProjectListOutput[]>`
   SELECT "id", "name" FROM "Projects" where "isArchived" = false
  `;
}

export async function getProjectById(projectId: string) {
  const where = Prisma.sql`AND p.id = ${projectId}`;

  const project = await prisma.$queryRaw<InternProjectOutput[]>`
    SELECT "id", "name", "createdAt", "description", "searchSkills", "updatedAt", "valueStatement"
    FROM "Projects" p
    WHERE "isArchived" = false
    ${where}
  `;

  return project[0];
}

export async function getProjectsByRole(roleId: string) {
  const roleVar = `%${roleId}%`;

  const projects = await prisma.$queryRaw<InternProjectOutput[]>`
    SELECT DISTINCT ON (p."id") p."id", p."name", p."createdAt", p."description", p."searchSkills"
    FROM "Projects" p
    INNER JOIN (
      SELECT 
        pmv."profileId", 
        pmv."role", 
        pmv."projectId", 
        ROW_NUMBER() OVER (PARTITION BY pmv."profileId" ORDER BY pmv."updatedAt" DESC) AS row_num
      FROM "ProjectMembersVersions" pmv
    ) AS latest_pmv
    ON latest_pmv."projectId" = p."id"
    WHERE p."isArchived" = false
    AND latest_pmv."role" LIKE ${roleVar}
    AND latest_pmv.row_num = 1
    ORDER BY p."id"
  `;

  return { projects, count: projects.length };
}
