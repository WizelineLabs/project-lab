import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { requireProfile, requireUser } from "~/session.server";
import { validator } from "~/core/components/RelatedProjectsSection";
import { validationError } from "remix-validated-form";
import {
  getProject,
  isProjectTeamMember,
  updateRelatedProjects,
} from "~/models/project.server";
import { adminRoleName } from "~/constants";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  const profile = await requireProfile(request);
  const user = await requireUser(request);
  const project = await getProject({ id: params.projectId });
  const isAdmin = user.role == adminRoleName;
  const isTeamMember = isProjectTeamMember(profile.id, project);

  if (!isAdmin || !isTeamMember) {
    return validationError({
      fieldErrors: {
        formError: "Operation not allowed",
      },
    });
  }

  const result = await validator.validate(await request.formData());
  if (result.error != undefined) return validationError(result.error);

  try {
    await updateRelatedProjects({
      id: projectId,
      data: result.data,
    });
    return redirect(`/projects/${projectId}`);
  } catch (e) {
    console.log(e);
    return validationError({
      fieldErrors: {
        formError: "Server failed",
      },
    });
  }
};
