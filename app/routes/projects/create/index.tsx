import Header from "app/core/layouts/Header";
import GoBack from "app/core/layouts/GoBack";
import { useNavigate } from "@remix-run/react";
import { ProjectForm } from "../components/ProjectForm";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { validationError } from "remix-validated-form";
import { json } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";

export const validator = withZod(
  z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().nonempty("Description is required"),
    textEditor: z.optional(z.string()),
    helpWanted: z.optional(z.boolean()),
  })
);

export const action: ActionFunction = async ({ request }) => {
  console.log("entering");
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);
  const { name, description, textEditor, helpWanted } = result.data;
  console.log(result.data);
  return json({ name, description, textEditor, helpWanted });
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
        <ProjectForm projectformType="create" />
      </div>
    </div>
  );
};

export default NewProjectPage;
