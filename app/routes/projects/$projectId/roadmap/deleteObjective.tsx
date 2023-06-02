import type { ActionFunction } from "@remix-run/server-runtime";
import { deleteValidator } from "../roadmap";
import { getSession } from "~/session.server";
import { redirect } from "remix-typedjson";
import { deleteObjective } from "~/models/objectives.server";
import { validationError } from "remix-validated-form";


export const action: ActionFunction = async ({ request, params }) => {
    const values = await deleteValidator.validate(await request.formData());
    const id = values.data?.id as string;
    const projectId = params.projectId;


    if (values.error != undefined) return validationError(values.error);
  
    try {
        await deleteObjective(id);
    } catch (e) {
      const session = await getSession(request);
      session.flash("warning", "Error while saving objective");
    }
    return redirect(`/projects/${projectId}/roadmap`);

}