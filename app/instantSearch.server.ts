import Typesense from "typesense";

interface SearchProjectsOutput {
  sort: number;
  id: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  description: string;
  preferredName: string;
  lastName: string;
  avatarUrl: string;
  status: string;
  color?: string;
  searchSkills?: { name: string }[];
  votesCount: number;
  projectMembers: number;
  owner?: string;
  tierName?: string;
  latest_pmw: boolean;
  resourcesCount?: number;
}

const client = new Typesense.Client({
  nodes: [
    {
      host: process.env.TYPESENSE_HOST || "localhost",
      port: process.env.TYPESENSE_PORT
        ? parseInt(process.env.TYPESENSE_PORT)
        : 8108,
      protocol: process.env.TYPESENSE_PROTOCOL || "http",
    },
  ],
  apiKey: process.env.TYPESENSE_ADMIN_API_KEY || "123",
  connectionTimeoutSeconds: 2,
});

async function getSortNumber() {
  try {
    const documentsResponse = await client
      .collections("projects")
      .documents()
      .search({
        q: "*",
        query_by: "*",
      });

    if (documentsResponse && documentsResponse.hits) {
      const documents: number[] = documentsResponse.hits.map(
        (hit: any) => hit.document.sort as number
      );

      const sortMax = Math.max(...documents);
      return sortMax;
    }
    return null;
  } catch (error) {
    console.error("Error tring to get the projects", error);
    throw error;
  }
}

export const addProjectToTypesense = async (project: any) => {
  project.sort = await getSortNumber();
  project.avatarUrl = project.avatarUrl || "";
  project.id_str = project.id;
  project.votesCount = parseInt(project.votesCount);
  project.projectMembers = parseInt(project.projectMembers) || 0;
  project.resourcesCount = parseInt(project.resourcesCount) || 0;
  project.color = project.color || "red";

  if (project.searchSkills.length == 0) {
    project.searchSkills = [{ id: "", name: "" }];
  }
  project.latest_pmw = project.latest_pmw || false;
  try {
    const returnData = await client
      .collections("projects")
      .documents()
      .import(project);

    console.log("Return data: ", returnData);
  } catch (err) {
    console.error(err);
  }
};

async function getSortNumberbyId(id: string) {
  try {
    const documentsResponse = await client
      .collections("projects")
      .documents()
      .search({
        q: `${id}`,
        query_by: "id_str",
      });

    if (documentsResponse && documentsResponse.hits) {
      const documents: number[] = documentsResponse.hits.map(
        (hit: any) => hit.document.sort as number
      );
      return documents[0];
    }
    return null;
  } catch (error) {
    console.error("Error tring to get the projects", error);
    throw error;
  }
}

export const getProjectByIdTypesense = async (id: string) => {
  try {
    const documentsResponse = await client
      .collections("projects")
      .documents()
      .search({
        q: `${id}`,
        query_by: "id_str",
      });

    if (documentsResponse && documentsResponse.hits) {
      const documents: SearchProjectsOutput[] = documentsResponse.hits.map(
        (hit: any) => hit.document as SearchProjectsOutput
      );
      return documents[0];
    }
    return null;
  } catch (error) {
    console.error("Error tring to get the projects", error);
    throw error;
  }
};

export const updateProjectToTypesense = async (id: string, project: any) => {
  const sortNumbers = await getSortNumberbyId(id);
  project.sort = sortNumbers;
  project.avatarUrl = project.avatarUrl || "";
  project.id_str = project.id;
  project.votesCount = parseInt(project.votesCount);
  project.projectMembers = parseInt(project.projectMembers) || 0;
  project.resourcesCount = parseInt(project.resourcesCount) || 0;
  project.color = project.color || "red";

  if (project.searchSkills.length == 0) {
    project.searchSkills = [{ id: "", name: "" }];
  }
  project.latest_pmw = project.latest_pmw || false;
  try {
    const returnData = await client
      .collections("projects")
      .documents()
      .update(project, { filter_by: `id_str:${id}` });

    console.log("Return data: ", returnData);
  } catch (err) {
    console.error(err);
  }
};

export const deleteProjectToTypesense = async (id: string) => {
  try {
    const returnData = await client
      .collections("projects")
      .documents()
      .delete({ filter_by: `id_str:${id}` });

    console.log("Return data: ", returnData);
  } catch (err) {
    console.error(err);
  }
};
