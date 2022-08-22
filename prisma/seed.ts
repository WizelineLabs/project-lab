import { PrismaClient } from "@prisma/client";
import { contributorPath } from "app/constants"
import seedProd from "./seeds.prod"

const db = new PrismaClient();

async function seed() {
  seedProd();
  let projectStages: any = []

  for (let i = 0; i < contributorPath?.length; i++) {
    const data = {
      name: contributorPath[i]?.name || "Failed",
      criteria: contributorPath[i]?.criteria || "Failed",
      mission: contributorPath[i]?.mission || "Failed",
    }
    const tasks = contributorPath[i]?.tasks || []
    const position = i + 1
    let projectTasks: any = []

    for (let j = 0; j < tasks.length; j++) {
      projectTasks.push({
        description: tasks[j]?.name,
        position: j + 1,
      })
    }

    projectStages.push({
      ...data,
      position: position,
      projectTasks: {
        create: projectTasks,
      },
    })
  }

  await db.skills.upsert({
    where: { id: "b27f5e6c-4470-4f83-8fd6-dc097e127f44" },
    update: {},
    create: { name: "React", id: "b27f5e6c-4470-4f83-8fd6-dc097e127f44" },
  })
  await db.skills.upsert({
    where: { id: "4b3d0d73-c3a6-457a-bd81-6b7b2be13373" },
    update: {},
    create: { name: "TypeScript", id: "4b3d0d73-c3a6-457a-bd81-6b7b2be13373" },
  })
  await db.skills.upsert({
    where: { id: "b70ca72b-0a56-47f8-af2d-695c79673a68" },
    update: {},
    create: { name: "SQLite", id: "b70ca72b-0a56-47f8-af2d-695c79673a68" },
  })
  await db.skills.upsert({
    where: { id: "6c859cfb-942c-40c8-b0b3-37de3e739c29" },
    update: {},
    create: { name: "AWS", id: "6c859cfb-942c-40c8-b0b3-37de3e739c29" },
  })
  await db.skills.upsert({
    where: { id: "66fc5f5f-3be4-453f-8978-8cc3334adda1" },
    update: {},
    create: { name: "Ruby", id: "66fc5f5f-3be4-453f-8978-8cc3334adda1" },
  })
  await db.skills.upsert({
    where: { id: "f88e6170-9382-4a89-87a4-b820e4b0ac33" },
    update: {},
    create: { name: "Java", id: "f88e6170-9382-4a89-87a4-b820e4b0ac33" },
  })
  await db.skills.upsert({
    where: { id: "d7e95b76-6fc0-4e11-9674-61233cbe60ca" },
    update: {},
    create: { name: "PostgreSQL", id: "d7e95b76-6fc0-4e11-9674-61233cbe60ca" },
  })
  await db.skills.upsert({
    where: { id: "f6d5b102-6cc4-41a8-8ca0-869aff695485" },
    update: {},
    create: { name: "MySQL", id: "f6d5b102-6cc4-41a8-8ca0-869aff695485" },
  })
  await db.skills.upsert({
    where: { id: "8ea79390-240d-4b23-bd25-5eae45ac5132" },
    update: {},
    create: { name: "Go", id: "8ea79390-240d-4b23-bd25-5eae45ac5132" },
  })
  await db.projectStatus.upsert({
    where: { name: "Idea Submitted" },
    update: {},
    create: { name: "Idea Submitted", color: "#fe6f18" },
  })
  await db.projectStatus.upsert({
    where: { name: "Need SME Review" },
    update: {},
    create: { name: "Need SME Review", color: "#188bff" },
  })
  await db.projectStatus.upsert({
    where: { name: "Idea in Progress" },
    update: {},
    create: { name: "Idea in Progress", color: "#7bc96b" },
  })
  await db.projectStatus.upsert({
    where: { name: "Need Tier Review" },
    update: {},
    create: { name: "Need Tier Review" },
  })
  await db.projectStatus.upsert({
    where: { name: "Closed" },
    update: {},
    create: { name: "Closed" },
  })
  await db.projectStatus.upsert({
    where: { name: "Inactive" },
    update: {},
    create: { name: "Inactive" },
  })

  await db.labels.upsert({
    where: { name: "Innovation Camp 2020" },
    update: {},
    create: { name: "Innovation Camp 2020" },
  })
  await db.labels.upsert({
    where: { name: "Innovation Camp 2021" },
    update: {},
    create: { name: "Innovation Camp 2021" },
  })
  const george = await db.profiles.upsert({
    where: { email: "george.wachira@wizeline.com" },
    update: {},
    create: {
      email: "george.wachira@wizeline.com",
      firstName: "George",
      lastName: "Wachira",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "antonio.torres@wizeline.com" },
    update: {},
    create: {
      email: "antonio.torres@wizeline.com",
      firstName: "Antonio",
      lastName: "Torres",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "fernanda.vargas@wizeline.com" },
    update: {},
    create: {
      email: "fernanda.vargas@wizeline.com",
      firstName: "Fernanda",
      lastName: "Vargas",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "miriam.cantero@wizeline.com" },
    update: {},
    create: {
      email: "miriam.cantero@wizeline.com",
      firstName: "Miriam",
      lastName: "Cantero",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "victor.cabrales@wizeline.com" },
    update: {},
    create: {
      email: "victor.cabrales@wizeline.com",
      firstName: "Victor",
      lastName: "Cabrales",
      department: "Engineering",
    },
  })
  const ev = await db.profiles.upsert({
    where: { email: "edgar.vazquez@wizeline.com" },
    update: {},
    create: {
      email: "edgar.vazquez@wizeline.com",
      firstName: "Edgar",
      lastName: "Vazquez",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "damaris.contreras@wizeline.com" },
    update: {},
    create: {
      email: "damaris.contreras@wizeline.com",
      firstName: "Dámaris",
      lastName: "Contreras",
      department: "Engineering",
    },
  })
  const jbc = await db.profiles.upsert({
    where: { email: "joaquin.bravo@wizeline.com" },
    update: {},
    create: {
      email: "joaquin.bravo@wizeline.com",
      firstName: "Joaquín",
      lastName: "Bravo Contreras",
      department: "Engineering",
    },
  })
  const tejeda = await db.profiles.upsert({
    where: { email: "luis.tejeda@wizeline.com" },
    update: {},
    create: {
      email: "luis.tejeda@wizeline.com",
      firstName: "Luis",
      lastName: "Tejeda",
      department: "Engineering",
    },
  })
  const jp = await db.profiles.upsert({
    where: { email: "joaquin.popoca@wizeline.com" },
    update: {},
    create: {
      email: "joaquin.popoca@wizeline.com",
      firstName: "Joaquin",
      lastName: "Popoca",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "sabino.arambula@wizeline.com" },
    update: {},
    create: {
      email: "sabino.arambula@wizeline.com",
      firstName: "Sabino",
      lastName: "Arambula",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "ruben.zavala@wizeline.com" },
    update: {},
    create: {
      email: "ruben.zavala@wizeline.com",
      firstName: "Rubén",
      lastName: "Zavala",
      department: "Engineering",
    },
  })
  const b = await db.profiles.upsert({
    where: { email: "b.neha@wizeline.com" },
    update: {},
    create: {
      email: "b.neha@wizeline.com",
      firstName: "B",
      lastName: "Neha",
      department: "Delivery",
    },
  })
  const enoc = await db.profiles.upsert({
    where: { email: "enoc.villa@wizeline.com" },
    update: {},
    create: {
      email: "enoc.villa@wizeline.com",
      firstName: "Enoc",
      lastName: "Villa",
      department: "Delivery",
    },
  })
  await db.profiles.upsert({
    where: { email: "gustavo.gonzalez@wizeline.com" },
    update: {},
    create: {
      email: "gustavo.gonzalez@wizeline.com",
      firstName: "Gustavo",
      lastName: "Gonzalez",
      department: "Delivery",
    },
  })
  await db.profiles.upsert({
    where: { email: "martin.molinero@wizeline.com" },
    update: {},
    create: {
      email: "martin.molinero@wizeline.com",
      firstName: "Martin",
      lastName: "Molinero",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "anibal.abarca@wizeline.com" },
    update: {},
    create: {
      email: "anibal.abarca@wizeline.com",
      firstName: "Aníbal",
      lastName: "Abarca",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "said.montiel@wizeline.com" },
    update: {},
    create: {
      email: "said.montiel@wizeline.com",
      firstName: "Said",
      lastName: "Montiel",
      department: "Engineering",
    },
  })

  await db.profiles.upsert({
    where: { email: "cesar.romero@wizeline.com" },
    update: {},
    create: {
      email: "cesar.romero@wizeline.com",
      firstName: "Cesar",
      lastName: "Romero",
      department: "Engineering",
    },
  })

  await db.profiles.upsert({
    where: { email: "christian.morlotte@wizeline.com" },
    update: {},
    create: {
      email: "christian.morlotte@wizeline.com",
      firstName: "Christian",
      lastName: "Morlotte",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "arzu.calderon@wizeline.com" },
    update: {},
    create: {
      email: "arzu.calderon@wizeline.com",
      firstName: "Shamed",
      lastName: "Calderón",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "jesus.corona@wizeline.com" },
    update: {},
    create: {
      email: "jesus.corona@wizeline.com",
      firstName: "Jesus",
      lastName: "Corona",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "rodrigo.delatorre@wizeline.com" },
    update: {},
    create: {
      email: "rodrigo.delatorre@wizeline.com",
      firstName: "Rodrigo",
      lastName: "Cervantes",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "test@wizeline.com" },
    update: {},
    create: {
      email: "test@wizeline.com",
      firstName: "Test",
      lastName: "Wizeline",
      department: "Engineering",
    },
  })
  const rSosa = await db.profiles.upsert({
    where: { email: "rodrigo.sosa@wizeline.com" },
    update: {},
    create: {
      email: "rodrigo.sosa@wizeline.com",
      firstName: "Rodrigo",
      lastName: "Sosa",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "diana.lopez@wizeline.com" },
    update: {},
    create: {
      email: "diana.lopez@wizeline.com",
      firstName: "Diana",
      lastName: "Lopez",
      department: "Engineering",
    },
  })
  const jquiroz = await db.profiles.upsert({
    where: { email: "juan.quiroz@wizeline.com" },
    update: {},
    create: {
      email: "juan.quiroz@wizeline.com",
      firstName: "Juan",
      lastName: "Quiroz",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "luis.lasso@wizeline.com" },
    update: {},
    create: {
      email: "luis.lasso@wizeline.com",
      firstName: "Luis",
      lastName: "Lasso",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "jorge.gc@wizeline.com" },
    update: {},
    create: {
      email: "jorge.gc@wizeline.com",
      firstName: "Jorge",
      lastName: "Gonzalez",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "leonardo.hervert@wizeline.com" },
    update: {},
    create: {
      email: "leonardo.hervert@wizeline.com",
      firstName: "Leonardo",
      lastName: "Hervert",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "pascual.hernandez@wizeline.com" },
    update: {},
    create: {
      email: "pascual.hernandez@wizeline.com",
      firstName: "Pascual",
      lastName: "Hernandez",
      department: "Engineering",
    },
  })
  const jamj = await db.profiles.upsert({
    where: { email: "jesus.martinez@wizeline.com" },
    update: {},
    create: {
      email: "jesus.martinez@wizeline.com",
      firstName: "Jesus",
      lastName: "Martinez",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "edwin.valdez@wizeline.com" },
    update: {},
    create: {
      email: "edwin.valdez@wizeline.com",
      firstName: "Edwin",
      lastName: "Valdez",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "jorge.galindo@wizeline.com" },
    update: {},
    create: {
      email: "jorge.galindo@wizeline.com",
      firstName: "Jorge",
      lastName: "Galindo",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "martin.robledo@wizeline.com" },
    update: {},
    create: {
      email: "martin.robledo@wizeline.com",
      firstName: "Martin",
      lastName: "Robledo",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "andres.contreras@team.wizeline.com" },
    update: {},
    create: {
      email: "andres.contreras@team.wizeline.com",
      firstName: "Andres",
      lastName: "Contreras",
      department: "Engineering",
    },
  })
  await db.profiles.upsert({
    where: { email: "diego.mojarro@team.wizeline.com" },
    update: {},
    create: {
      email: "diego.mojarro@team.wizeline.com",
      firstName: "Diego",
      lastName: "Mojarro",
      department: "Engineering",
    },
  })

  console.info("Profiles created, starting projects upsert")

  const pH = await db.projects.upsert({
    where: { name: "Proposal Hunt" },
    update: {},
    create: {
      name: "Proposal Hunt",
      owner: { connect: { id: jp.id } },
      description: "Visibility of projects",
      valueStatement: "Socialize them with comments, votes, simple search.",
      target: "All wizeliners",
      projectStatus: { connect: { name: "Need SME Review" } },
      searchSkills: "TypeScript, SQLite, React",
      skills: {
        connect: [
          { id: "4b3d0d73-c3a6-457a-bd81-6b7b2be13373" },
          { id: "b70ca72b-0a56-47f8-af2d-695c79673a68" },
          { id: "b27f5e6c-4470-4f83-8fd6-dc097e127f44" },
        ],
      },
      labels: { connect: [{ name: "Innovation Camp 2020" }] },
      projectMembers: {
        create: [
          {
            profile: { connect: { id: jp.id } },
            hoursPerWeek: 3,
            role: "Tech Lead",
          },
        ],
      },
      stages: {
        create: projectStages,
      },
    },
  })
  console.info("Project created:", pH.id, pH.name)
  const pL = await db.projects.upsert({
    where: { name: "Project Lab" },
    update: {},
    create: {
      name: "Project Lab",
      owner: { connect: { id: jbc.id } },
      innovationTiers: { connect: { name: "Tier 1" } },
      description: "Visibility of initiatives. Follow up of skills and work from Wizeliners",
      valueStatement: "New WCI board",
      target: "All wizeliners",
      projectStatus: { connect: { name: "Need SME Review" } },
      searchSkills: "TypeScript, SQLite, React",
      skills: {
        connect: [
          { id: "4b3d0d73-c3a6-457a-bd81-6b7b2be13373" },
          { id: "b70ca72b-0a56-47f8-af2d-695c79673a68" },
          { id: "b27f5e6c-4470-4f83-8fd6-dc097e127f44" },
        ],
      },
      disciplines: {
        connect: [{ name: "UX Designer" }, { name: "Backend" }, { name: "Frontend" }],
      },
      labels: { connect: [{ name: "Innovation Camp 2020" }, { name: "Innovation Camp 2021" }] },
      projectMembers: {
        create: [
          {
            profile: { connect: { id: jbc.id } },
            hoursPerWeek: 3,
            role: "Frontend",
          },
          {
            profile: { connect: { id: tejeda.id } },
            hoursPerWeek: 3,
            role: "Backend",
          },
          {
            profile: { connect: { id: george.id } },
            hoursPerWeek: 3,
            role: "SRE",
          },
          {
            profile: { connect: { id: jquiroz.id } },
            hoursPerWeek: 3,
            role: "Frontend",
          },
          {
            profile: { connect: { id: jamj.id } },
            hoursPerWeek: 3,
            role: "Frontend",
            practicedSkills: {
              connect: [
                { id: "b27f5e6c-4470-4f83-8fd6-dc097e127f44" },
                { id: "4b3d0d73-c3a6-457a-bd81-6b7b2be13373" },
              ],
            },
          },
        ],
      },
      stages: {
        create: projectStages,
      },
    },
  })
  console.info("Project created:", pL.id, pL.name)

  const wS = await db.projects.upsert({
    where: { name: "Wizepace" },
    update: {},
    create: {
      name: "Wizepace",
      owner: { connect: { id: ev.id } },
      innovationTiers: { connect: { name: "Tier 2" } },
      description:
        "The global pandemic has changed how we view the workplace and the needs we have. However, the office is still one of many tools that Wizeliners have to facilitate collaboration and social engagement. Acknowledging the previous facts, we need to think of a way to come back to our workplaces",
      valueStatement: `This solution is called Wizeline + Space = Wizepace. We will implement a solution that:
    * Gives Wizeliners the ability to: Book a desk and Visit different offices or locations.
    * Fulfills the expectations of hybrid work: from home and the office.
    * Helps the Facilities Team to maximize the use of our workspace and comply with health and safety regulations. ",
    target: "All wizeliners`,
      projectStatus: { connect: { name: "Need SME Review" } },
      searchSkills: "React, AWS, Ruby",
      skills: {
        connect: [
          { id: "6c859cfb-942c-40c8-b0b3-37de3e739c29" },
          { id: "66fc5f5f-3be4-453f-8978-8cc3334adda1" },
          { id: "b27f5e6c-4470-4f83-8fd6-dc097e127f44" },
        ],
      },
      disciplines: { connect: [{ name: "Backend" }] },
      labels: { connect: [{ name: "Innovation Camp 2021" }] },
      projectMembers: {
        create: [
          {
            profile: { connect: { id: ev.id } },
            hoursPerWeek: 3,
            role: "Tech Lead",
          },
        ],
      },
      stages: {
        create: projectStages,
      },
    },
  })
  console.info("Project created:", wS.id, wS.name)

  const wR = await db.projects.upsert({
    where: { name: "WizeRunner" },
    update: {},
    create: {
      name: "WizeRunner",
      owner: { connect: { id: b.id } },
      description:
        "With the current pandemic situation, people are advised not to gather in large numbers for any sporting events such as mass running tournaments. Moreover, many individuals do not necessarily have to compete with others since competing against themselves offers the greatest reward. From those reasons, we came up with the idea to build a system not only for Wizeliners but also for the community so that everyone can stay motivated and boost their competitive spirit through running challenges and virtual races.",
      valueStatement:
        "Nowadays, there are a number of systems that allow users to participate in running challenges or participate in virtual races with some limitations. The first drawback is that most of these systems are not free. Users have to pay to be able to participate in virtual races or to be able to join public or private running challenges individually or with a team. The second limitation is that some of the paid systems, such as the ChallengeRunner, have a rather monotonous and boring design and reporting. That may reduce the users' motivation when using the app. Finally, most systems only support one of two functions, either participating in running challenges or participating in virtual races. In other words, to use both of those functions, users have to use and switch between two separate systems which is complex and costly. That motivates us to build a centralized system for Wizeliners to improve physical and mental health through virtual running functions.",
      target: "All wizeliners",
      projectStatus: { connect: { name: "Idea Submitted" } },
      searchSkills: "Java, PostgreSQL, React",
      skills: {
        connect: [
          { id: "f88e6170-9382-4a89-87a4-b820e4b0ac33" },
          { id: "d7e95b76-6fc0-4e11-9674-61233cbe60ca" },
          { id: "b27f5e6c-4470-4f83-8fd6-dc097e127f44" },
        ],
      },
      labels: { connect: [{ name: "Innovation Camp 2021" }] },
      projectMembers: {
        create: [
          {
            profile: { connect: { id: b.id } },
            hoursPerWeek: 3,
            role: "Tech Lead",
          },
        ],
      },
      stages: {
        create: projectStages,
      },
    },
  })
  console.info("Project created:", wR.id, wR.name)

  const sC = await db.projects.upsert({
    where: { name: "Sorting Cat / Communities Platform" },
    update: {},
    create: {
      name: "Sorting Cat / Communities Platform",
      owner: { connect: { id: enoc.id } },
      description:
        "We want to create a new platform where wizeliners can see all the existing communities and send a request to form part of the one they like the most. Community Champions can also manage their community information and see all the people within. ",
      valueStatement: `Communities play an important role in creating a sense of belonging among engineers at Wizeline. With the new portfolio organization, the importance of the communities only grows, as they create an opportunity for wizeliners with similar interests to share experiences,  seek help, and learn new things.

    Before the portfolio re-organization, communities were grouped by discipline and office. As communities become a global entity within Wizeline, we realized there was no unique place for engineers to see the existing communities and have an automated process to get assigned to the community of their choice.

    We wanted to create a new platform for wizeliners to see the full list of available communities and what was the goal and team members and communication channels of each one. We also wanted to give community champions the ability to manage their communities and people who form part of the community.

    During the initial Innovation Camp sessions, where we pitched our idea in order to search for people to join the team, we realized there was a similar initiative for a community platform, which was developed by another team in Guadalajara. They had some work done but because of bandwidth, there was still a lot to get done in order to get the platform to be functional.

    We decided to join efforts and take the work that was already developed and finish the basic functionality so we can deliver this platform faster and gets ready to use in less time. `,
      target: "All wizeliners",
      projectStatus: { connect: { name: "Need SME Review" } },
      searchSkills: "Go, MySQL, React",
      skills: {
        connect: [
          { id: "8ea79390-240d-4b23-bd25-5eae45ac5132" },
          { id: "f6d5b102-6cc4-41a8-8ca0-869aff695485" },
          { id: "b27f5e6c-4470-4f83-8fd6-dc097e127f44" },
        ],
      },
      labels: { connect: [{ name: "Innovation Camp 2021" }] },
      projectMembers: {
        create: [
          {
            profile: { connect: { id: enoc.id } },
            hoursPerWeek: 3,
            role: "Tech Lead",
          },
        ],
      },
      stages: {
        create: projectStages,
      },
    },
  })
  console.info("Project created:", sC.id, sC.name)

  console.log(`Database has been seeded. 🌱`);
}

seed()
  .catch((e) => {
    console.error("Error: ", e);
    process.exit(1);
  })
  .finally(async () => {
    await db.$disconnect();
  });
