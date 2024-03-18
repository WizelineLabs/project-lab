import { ProjectForm } from "../core/components/ProjectForm";
import { Container, Paper } from "@mui/material";
import { Prisma } from "@prisma/client";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import MarkdownStyles from "@uiw/react-markdown-preview/markdown.css";
import MDEditorStyles from "@uiw/react-md-editor/markdown-editor.css";
import GoBack from "app/core/components/GoBack";
import Header from "app/core/layouts/Header";
import { validationError, ValidatedForm } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { createProject } from "~/models/project.server";
import { requireProfile } from "~/session.server";

export function links() {
  return [
    { rel: "stylesheet", href: MDEditorStyles },
    { rel: "stylesheet", href: MarkdownStyles },
  ];
}

export const validator = withZod(
  zfd
    .formData({
      name: zfd.text(z.string().min(1)),
      description: zfd.text(z.string().min(1)),
      valueStatement: zfd.text(z.string().optional()),
      helpWanted: zfd.checkbox(),
      status: z.string().optional(),
      tierName: z.string().optional(),
      ownerId: z.string().optional(),
      disciplines: z
        .array(
          z.object({
            id: z.string(),
            name: z.string().optional(),
          })
        )
        .optional(),
      target: zfd.text(z.string().optional()),
      repoUrls: z
        .array(
          z.object({
            url: zfd.text(z.string().url()),
            id: zfd.numeric().optional(),
          })
        )
        .optional(),
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
      projectBoard: zfd.text(z.string().url().optional()),
    })
    .transform((val) => {
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
      e instanceof Prisma.PrismaClientKnownRequestError &&
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
    <>
      <Header title="Create your proposal" />
      <Container>
        <Paper elevation={0} sx={{ paddingLeft: 2, paddingRight: 2 }}>
          <h1>Create your proposal</h1>
        </Paper>
      </Container>
      <Container>
        <Paper
          elevation={0}
          sx={{ paddingLeft: 2, paddingRight: 2, paddingBottom: 2 }}
        >
          <GoBack title="Back to main page" href="/projects" />
          <ValidatedForm
            id="create-project-form"
            validator={validator}
            defaultValues={{
              name: "",
              description: "",
              helpWanted: true,
              skills: [],
              labels: [],
            }}
            method="post"
          >
            <ProjectForm projectformType="create" />
          </ValidatedForm>
        </Paper>
      </Container>
    </>
  );
};

export default NewProjectPage;
