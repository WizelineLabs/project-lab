import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { validator } from "~/core/components/JoinProjectModal";
import { joinProject } from "~/models/project.server";
import { requireProfile } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  const profile = await requireProfile(request);
  const result = await validator.validate(await request.formData());

  if (result.error != undefined) return validationError(result.error);

  try {
    await joinProject(projectId, profile.id, result.data);
    return redirect(`/projects/${projectId}`);
  } catch (e) {
    return validationError({
      fieldErrors: {
        formError: "Server failed",
      },
    });
  }
};
