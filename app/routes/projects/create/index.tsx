import Header from "app/core/layouts/Header";
import GoBack from "app/core/layouts/GoBack";
import { useNavigate } from "@remix-run/react";
import { ProjectForm } from "../components/ProjectForm";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { validationError, ValidatedForm } from "remix-validated-form";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { zfd } from "zod-form-data";

export const validator = withZod(
  z
    .object({
      name: z.string().nonempty("Name is required"),
      description: z.string().nonempty("Description is required"),
      textEditor: z.optional(z.string()),
      helpWanted: z.optional(z.boolean()),
      disciplines: zfd.repeatable(z.array(z.string()).optional()),
      target: z.optional(z.string()),
      repoUrls: zfd.repeatable(z.array(z.string()).optional()),
      slackChannels: z.optional(z.string()),
      skills: zfd.repeatable(z.array(z.string()).optional()),
      labels: zfd.repeatable(z.array(z.string()).optional()),
      relatedProjects: zfd.repeatable(z.array(z.string()).optional()),
      projectMembers: zfd.repeatable(z.array(z.string()).optional()),
    })
    .transform((val) => {
      val.disciplines = val.disciplines?.filter((el) => el != "");
      val.repoUrls = val.repoUrls?.filter((el) => el != "");
      val.skills = val.skills?.filter((el) => el != "");
      val.labels = val.labels?.filter((el) => el != "");
      val.relatedProjects = val.relatedProjects?.filter((el) => el != "");
      val.projectMembers = val.projectMembers?.filter((el) => el != "");
      return val;
    })
);

export const action: ActionFunction = async ({ request }) => {
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);
  const {
    name,
    description,
    textEditor,
    helpWanted,
    disciplines,
    target,
    repoUrls,
    slackChannels,
    skills,
    labels,
    relatedProjects,
    projectMembers,
  } = result.data;
  console.log(result.data);
  return json({
    name,
    description,
    textEditor,
    helpWanted,
    disciplines,
    target,
    repoUrls,
    slackChannels,
    skills,
    labels,
    relatedProjects,
    projectMembers,
  });
};

const NewProjectPage = () => {
  const navigate = useNavigate();
  return (
    <div>
      <Header title="Create your proposal" />
      <div className="wrapper">
        <h1 className="form__center-text">Create your proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" onClick={() => navigate("/")} />
        <ValidatedForm validator={validator} method="post">
          <ProjectForm projectformType="create" />
        </ValidatedForm>
      </div>
    </div>
  );
};

export default NewProjectPage;
