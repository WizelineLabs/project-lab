import Header from "app/core/layouts/Header";
import GoBack from "app/core/components/GoBack";
import { ProjectForm } from "./components/ProjectForm";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { validationError, ValidatedForm } from "remix-validated-form";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { zfd } from "zod-form-data";
import { requireProfile } from "~/session.server";
import { createProject } from "~/models/project.server";
import { PrismaClientKnownRequestError } from "@prisma/client/runtime";

export const validator = withZod(
  zfd
    .formData({
      name: zfd.text(z.string().min(1)),
      description: zfd.text(z.string().min(1)),
      valueStatement: zfd.text(z.string().optional()),
      helpWanted: zfd.checkbox(),
      disciplines: z
        .array(
          z.object({
            id: z.string(),
            name: z.string().optional(),
          })
        )
        .optional(),
      target: zfd.text(z.string().optional()),
      repoUrls: zfd.repeatable(
        z.array(
          z.object({
            url: zfd.text(),
          })
        )
      ),
      slackChannel: zfd.text(z.string().optional()),
      skills: z
        .array(
          z.object({
            id: z.string(),
            name: z.string().optional(),
          })
        )
        .optional(),
      labels: z
        .array(
          z.object({
            id: z.string(),
            name: z.string().optional(),
          })
        )
        .optional(),
      // relatedProjectsA: zfd.repeatable(z.array(z.string()).optional()),
    })
    .transform((val) => {
      // val.relatedProjectsA = val.relatedProjectsA?.filter((el) => el != "");
      return val;
    })
);

export const action: ActionFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  const result = await validator.validate(await request.formData());

  if (result.error) return validationError(result.error);

  try {
    const project = await createProject(result.data, profile.id);
    return redirect(`/projects/${project.id}`);
  } catch (e) {
    if (
      e instanceof PrismaClientKnownRequestError &&
      Array.isArray(e.meta?.target)
    ) {
      if (e.meta?.target.includes("name")) {
        return validationError({
          fieldErrors: {
            name: "Project name already exists",
          },
        });
      } else {
        return validationError({
          fieldErrors: {
            [e.meta?.target[0]]: "Invalid value",
          },
        });
      }
    }
    throw e;
  }
};

const NewProjectPage = () => {
  return (
    <div>
      <Header title="Create your proposal" />
      <div className="wrapper">
        <h1 className="form__center-text">Create your proposal</h1>
      </div>
      <div className="wrapper">
        <GoBack title="Back to main page" href="/" />
        <ValidatedForm
          validator={validator}
          defaultValues={{
            name: "",
            description: "",
            helpWanted: false,
            skills: [],
            labels: [],
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
