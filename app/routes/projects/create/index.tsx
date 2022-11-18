import Header from "app/core/layouts/Header";
import GoBack from "app/core/layouts/GoBack";
import { useLoaderData, useNavigate } from "@remix-run/react";
import { ProjectForm } from "../components/ProjectForm";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { validationError, ValidatedForm } from "remix-validated-form";
import { json, redirect } from "@remix-run/node";
import type { ActionFunction, LoaderFunction } from "@remix-run/node";
import { zfd } from "zod-form-data";
import { requireProfile } from "~/session.server";
import { createProject } from "~/models/project.server";

export const validator = withZod(
  z
    .object({
      name: z.string().nonempty("Name is required"),
      description: z.string().nonempty("Description is required"),
      valueStatement: z.optional(z.string()),
      helpWanted: zfd.checkbox(),
      disciplines: zfd.repeatable(z.array(z.string()).optional()),
      target: z.optional(z.string()),
      repoUrls: zfd.repeatable(z.array(z.string()).optional()),
      slackChannels: z.optional(z.string()),
      skills: zfd.repeatable(z.array(z.string()).optional()),
      labels: zfd.repeatable(z.array(z.string()).optional()),
      // relatedProjectsA: zfd.repeatable(z.array(z.string()).optional()),
      projectMembers: zfd.repeatable(
        z
          .array(
            z.object({
              name: z.string().optional(),
              roles: zfd.repeatable(z.array(z.string()).optional()),
              skills: zfd.repeatable(z.array(z.string()).optional()),
              hours: z.string().optional(),
              active: zfd.checkbox(),
            })
          )
          .optional()
      ),
    })
    .transform((val) => {
      val.disciplines = val.disciplines?.filter((el) => el != "");
      val.repoUrls = val.repoUrls?.filter((el) => el != "");
      val.skills = val.skills?.filter((el) => el != "");
      val.labels = val.labels?.filter((el) => el != "");
      // val.relatedProjectsA = val.relatedProjectsA?.filter((el) => el != "");
      return val;
    })
);

export const action: ActionFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);
  // const project = await createProject(result.data, profile.id);
  // return redirect(`/projects/${project.id}`);
  console.log(result.data);
  return result.data;
};

export const loader: LoaderFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  return json({ profile });
};

const NewProjectPage = () => {
  const navigate = useNavigate();
  const { profile } = useLoaderData();

  return (
    <div>
      <Header title="Create your proposal" />
      <div className="wrapper">
        <h1 className="form__center-text">Create your proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" onClick={() => navigate("/")} />
        <ValidatedForm
          validator={validator}
          defaultValues={{
            helpWanted: false,
            projectMembers: [
              {
                name: profile.name,
                roles: ["Owner"],
                skills: [],
                hours: "0",
                active: true,
              },
            ],
          }}
          method="post"
        >
          <ProjectForm projectformType="create" />
        </ValidatedForm>
      </div>
    </div>
  );
};

export default NewProjectPage;
