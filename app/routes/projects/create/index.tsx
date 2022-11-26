import Header from "app/core/layouts/Header"
import GoBack from "app/core/layouts/GoBack"
import { useLoaderData, useNavigate } from "@remix-run/react"
import { ProjectForm } from "../components/ProjectForm"
import { withZod } from "@remix-validated-form/with-zod"
import { z } from "zod"
import { validationError, ValidatedForm } from "remix-validated-form"
import { json, redirect } from "@remix-run/node"
import type { ActionFunction, LoaderFunction } from "@remix-run/node"
import { zfd } from "zod-form-data"
import { requireProfile } from "~/session.server"
import { createProject, projectNameExists } from "~/models/project.server"

export const validator = withZod(
  zfd
    .formData({
      name: zfd.text(z.string().min(1)),
      description: zfd.text(z.string().min(1)),
      valueStatement: zfd.text(z.string().optional()),
      helpWanted: zfd.checkbox(),
      disciplines: zfd.repeatable(z.array(z.string()).optional()),
      target: zfd.text(z.string().optional()),
      repoUrls: zfd.repeatable(
        z
          .array(
            z.object({
              url: zfd.text(z.string().optional()),
            })
          )
          .optional()
      ),
      slackChannels: zfd.text(z.string().optional()),
      skills: zfd.repeatable(z.array(z.string()).optional()),
      labels: zfd.repeatable(z.array(z.string()).optional()),
      // relatedProjectsA: zfd.repeatable(z.array(z.string()).optional()),
      projectMembers: zfd.repeatable(
        z
          .array(
            z.object({
              profileId: zfd.text(),
              name: zfd.text(z.string().optional()),
              roles: zfd.repeatable(z.array(z.string()).optional()),
              skills: zfd.repeatable(z.array(z.string()).optional()),
              hours: zfd.text(z.string().optional()),
              active: zfd.checkbox(),
            })
          )
          .optional()
      ),
    })
    .transform((val) => {
      val.disciplines = val.disciplines?.filter((el) => el != "")
      val.skills = val.skills?.filter((el) => el != "")
      val.labels = val.labels?.filter((el) => el != "")
      // val.relatedProjectsA = val.relatedProjectsA?.filter((el) => el != "");
      return val
    })
)

export const action: ActionFunction = async ({ request }) => {
  const profile = await requireProfile(request)
  const result = await validator.validate(await request.formData())

  if (result.error) return validationError(result.error)

  const { name } = result.data

  if (await projectNameExists(name)) {
    return validationError({
      fieldErrors: {
        name: "Project name already exists",
      },
    })
  }

  try {
    const project = await createProject(result.data, profile.id)
    return redirect(`/projects/${project.id}`)
  } catch (error) {
    if (error instanceof Error) {
      console.log(error.message)
      return json({ error: error.message }, { status: 500 })
    }
  }
}

export const loader: LoaderFunction = async ({ request }) => {
  const profile = await requireProfile(request)
  return json({ profile })
}

const NewProjectPage = () => {
  const navigate = useNavigate()
  const { profile } = useLoaderData()

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
                profileId: profile.id,
                name: profile.name,
                roles: [],
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
  )
}

export default NewProjectPage
