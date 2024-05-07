const { Kysely, PostgresDialect } = require("kysely");
const { jsonArrayFrom } = require("kysely/helpers/postgres");
const { Pool } = require("pg");
require("dotenv").config();
const Typesense = require("typesense");

const dialect = new PostgresDialect({
  pool: new Pool({
    connectionString: process.env.DATABASE_URL,
    max: 10,
  }),
});

const db = new Kysely({
  dialect: dialect,
});

async function getProjects() {
  try {
    const resultado = await db
      .selectFrom("Projects as p")
      .innerJoin("ProjectStatus as s", "s.name", "p.status")
      .innerJoin("Profiles as pr", "pr.id", "p.ownerId")
      .innerJoin("ProjectMembers as pm", "pm.projectId", "p.id")
      .leftJoin("Vote as v", "v.projectId", "p.id")
      .leftJoin("Resource as r", "r.projectId", "p.id")
      .select([
        "p.id",
        "p.name",
        "p.description",
        "pr.preferredName",
        "pr.lastName",
        "pr.avatarUrl",
        "p.status",
        db.fn.count("v.profileId").as("votesCount"),
        "s.color",
        "p.createdAt",
        "p.updatedAt",
        "p.ownerId",
        "p.tierName",
        db.fn.count("pm.profileId").as("projectMembers"),
        db.fn.count("r.id").as("resourcesCount"),
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("Skills as s")
            .innerJoin("_ProjectsToSkills as ps", "ps.B", "s.id")
            .select(["s.id", "s.name"])
            .whereRef("p.id", "=", "ps.A")
            .orderBy("s.name")
        ).as("searchSkills"),
      ])
      .select((eb) => [
        jsonArrayFrom(
          eb
            .selectFrom("ProjectMembersVersions as pmw")
            .select(["pmw.profileId", "pmw.role", "pmw.projectId"])
            .whereRef("pmw.projectId", "=", "p.id")
            .orderBy("pmw.profileId")
        ).as("latest_pmw"),
      ])
      .groupBy("p.id")
      .groupBy("pr.id")
      .groupBy("s.name")
      .execute();
    return resultado;
  } catch (error) {
    console.error("Error al obtener todos los proyectos:", error);
    throw error;
  }
}

let client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST,
      port: process.env.TYPESENSE_PORT,
      protocol: process.env.TYPESENSE_PROTOCOL,
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY,
  connectionTimeoutSeconds: 2,
});

const deleteSchema = async () => {
  // Collection name to delete
  const collectionName = "projects";

  // Try to delete
  client
    .collections(collectionName)
    .delete()
    .then(function (data) {
      console.log("Colección eliminada:", data);
    })
    .catch(function (error) {
      console.error("Hubo un error al eliminar la colección:", error);
    });
};

const createSchema = async () => {
  try {
    // Schema Definition
    const schema = {
      name: "projects",
      num_documents: 0,
      fields: [
        {
          name: "sort",
          type: "int32",
          facet: false,
        },
        {
          name: "id",
          type: "string",
          facet: false,
        },
        {
          name: "id_str",
          type: "string",
          facet: false,
        },
        {
          name: "name",
          type: "string",
          facet: false,
        },
        {
          name: "description",
          type: "string",
          facet: false,
        },
        {
          name: "searchSkills",
          type: "object[]",
          facet: false,
        },
        {
          name: "preferredName",
          type: "string",
          facet: false,
        },
        {
          name: "lastName",
          type: "string",
          facet: false,
        },
        {
          name: "avatarUrl",
          type: "string",
          facet: false,
        },
        {
          name: "status",
          type: "string",
          facet: false,
        },
        {
          name: "votesCount",
          type: "int64",
          facet: false,
        },
        {
          name: "color",
          type: "string",
          facet: false,
        },
        {
          name: "createdAt",
          type: "string",
          facet: false,
        },
        {
          name: "updatedAt",
          type: "string",
          facet: false,
        },
        {
          name: "ownerId",
          type: "string",
          facet: false,
        },
        {
          name: "tierName",
          type: "string",
          facet: false,
        },
        {
          name: "projectMembers",
          type: "int64",
          facet: false,
        },
        {
          name: "resourcesCount",
          type: "int64",
          facet: false,
        },
        {
          name: "latest_pmw",
          type: "bool",
          facet: true,
        },
      ],
      default_sorting_field: "sort",
      enable_nested_fields: true,
    };

    console.log("Creating schema...");
    console.log(JSON.stringify(schema, null, 2));

    await client.collections().create(schema);
  } catch (error) {
    console.error("Error: ", error);
  }
};

const fillSchema = async () => {
  const projects = await getProjects();

  projects.forEach((project, index) => {
    project.sort = index + 1;
    project.avatarUrl = project.avatarUrl || "";
    project.id_str = project.id;
    project.votesCount = parseInt(project.votesCount);
    project.projectMembers = parseInt(project.projectMembers);
    project.resourcesCount = parseInt(project.resourcesCount);
    if (project.searchSkills.length == 0) {
      project.searchSkills = [{ id: "", name: "" }];
    }
    const rawMentor = project.latest_pmw.filter((pmw) =>
      pmw.role.includes("5df5fb9a-c7m9-4ef0-8825-d83b77d22221")
    );

    project.latest_pmw = rawMentor.length > 0 ? true : false;
  });

  try {
    const returnData = await client
      .collections("projects")
      .documents()
      .import(projects);

    console.log("Return data: ", returnData);
  } catch (err) {
    console.error(err);
  }
};

async function createTypesenseDatabase() {
  await deleteSchema();
  await createSchema();
  await fillSchema();
}

createTypesenseDatabase();
