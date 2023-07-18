import { PrismaClient } from '@prisma/client';

/*
 * This seed function is executed when you run `blitz db seed`.
 *
 * Probably you want to use a library like https://chancejs.com
 * or https://github.com/Marak/Faker.js to easily generate
 * realistic data.
 */

const db = new PrismaClient();

const seed = async () => {
  await db.disciplines.upsert({
    where: { name: "Backend" },
    update: {},
    create: { name: "Backend" },
  })
  await db.disciplines.upsert({
    where: { name: "Frontend" },
    update: {},
    create: { name: "Frontend" },
  })
  await db.disciplines.upsert({
    where: { name: "Fullstack" },
    update: {},
    create: { name: "Fullstack" },
  })
  await db.disciplines.upsert({
    where: { name: "Evolution Engineer" },
    update: {},
    create: { name: "Evolution Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "iOS Engineer" },
    update: {},
    create: { name: "iOS Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "Android Engineer" },
    update: {},
    create: { name: "Android Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "React Native Engineer" },
    update: {},
    create: { name: "React Native Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "Tech Lead" },
    update: {},
    create: { name: "Tech Lead" },
  })
  await db.disciplines.upsert({
    where: { name: "Manual QA" },
    update: {},
    create: { name: "Manual QA" },
  })
  await db.disciplines.upsert({
    where: { name: "Automation QA" },
    update: {},
    create: { name: "Automation QA" },
  })
  await db.disciplines.upsert({
    where: { name: "Data Scientist" },
    update: {},
    create: { name: "Data Scientist" },
  })
  await db.disciplines.upsert({
    where: { name: "Data Engineer" },
    update: {},
    create: { name: "Data Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "Data Analyst" },
    update: {},
    create: { name: "Data Analyst" },
  })
  await db.disciplines.upsert({
    where: { name: "Site Reliability Engineer" },
    update: {},
    create: { name: "Site Reliability Engineer" },
  })
  await db.disciplines.upsert({
    where: { name: "Technical Writer" },
    update: {},
    create: { name: "Technical Writer" },
  })
  await db.disciplines.upsert({
    where: { name: "UX Designer" },
    update: {},
    create: { name: "UX Designer" },
  })
  await db.disciplines.upsert({
    where: { name: "Visual Designer (UI)" },
    update: {},
    create: { name: "Visual Designer (UI)" },
  })
  await db.disciplines.upsert({
    where: { name: "Project Manager" },
    update: {},
    create: { name: "Project Manager" },
  })
  await db.disciplines.upsert({
    where: { name: "Product Manager" },
    update: {},
    create: { name: "Product Manager" },
  })
  await db.disciplines.upsert({
    where: { name: "Mentor" },
    update: {},
    create: { name: "Mentor" },
  })
  await db.disciplines.upsert({
    where: { name: "Intern" },
    update: {},
    create: { name: "Intern" },
  })
  await db.disciplines.upsert({
    where: { name: "Owner" },
    update: {},
    create: { name: "Owner" },
  })
  await db.disciplines.upsert({
    where: { name: "Stakeholder" },
    update: {},
    create: { name: "Stakeholder" },
  })
  await db.disciplines.upsert({
    where: { name: "Consultant" },
    update: {},
    create: { name: "Consultant" },
  })

  await db.innovationTiers.upsert({
    where: { name: "Tier 3 (Experiment)" },
    update: {},
    create: {
      name: "Tier 3 (Experiment)",
      benefits: "Have a one time 50 USD budget",
      requisites: "None, manager approval",
      goals: "Create an artifact (documentation, blog post, etc)",
      defaultRow: true,
    },
  })
  await db.innovationTiers.upsert({
    where: { name: "Tier 2" },
    update: {},
    create: {
      name: "Tier 2",
      benefits: "Have a monthly 50 USD budget",
      requisites: "Having a tier revision with stakeholders and innovation team",
      goals: "Have sustained innovation",
    },
  })
  await db.innovationTiers.upsert({
    where: { name: "Tier 1" },
    update: {},
    create: {
      name: "Tier 1",
      benefits: "Have a monthly 150 USD budget",
      requisites: "Having a tier revision with stakeholders and innovation team",
      goals: "Mature and scale innovation projects",
    },
  })
  await db.innovationTiers.upsert({
    where: { name: "Tier 0" },
    update: {},
    create: {
      name: "Tier 0",
      benefits: "Have assigned staff",
      requisites: "Having a tier revision with stakeholders and innovation team",
      goals: "Help Wizeline become an intelligence driven company",
    },
  })
}

export default seed
