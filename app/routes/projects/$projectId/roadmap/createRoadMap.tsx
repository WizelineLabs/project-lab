import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { getSession } from "~/session.server";
import { validator } from "~/routes/projects/$projectId/roadmap";
import { validationError } from "remix-validated-form";
import { createObjective } from "~/models/objectives.server";



export const action: ActionFunction = async ({ request, params }) => {
    invariant(params.projectId, "projectId could not be found");
    const values = await validator.validate(await request.formData());
    const projectId = params.projectId;
    const name = values.data?.name as string;
    const input = values.data?.input as string;
    const result = values.data?.result as string;
    const quarter = values.data?.quarter.name as string;
    const status = values.data?.status.name as string;

    // eslint-disable-next-line no-console
    console.log(projectId, name, input, result, quarter, status)

  
    if (values.error != undefined) return validationError(values.error);
  
    try {
        await createObjective(projectId, name, input, result, quarter, status)
    } catch (e) {
      const session = await getSession(request);
      session.flash("warning", "Error while saving objective");
    }
    return redirect(`/projects/${projectId}/roadmap`);
  };