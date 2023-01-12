import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { requireProfile } from "~/session.server";
import { validator } from "~/core/components/MembershipStatusModal";
import { validationError } from "remix-validated-form";
import {
  getProject,
  getProjectTeamMember,
  updateMembership,
} from "~/models/project.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  const profile = await requireProfile(request);
  const project = await getProject({ id: params.projectId });
  const membership = getProjectTeamMember(profile.id, project);

  if (!membership) {
    return validationError({
      fieldErrors: {
        formError: "Operation not allowed",
      },
    });
  }

  const result = await validator.validate(await request.formData());

  if (result.error != undefined) return validationError(result.error);

  try {
    await updateMembership(projectId, membership.id, result.data);
    return redirect(`/projects/${projectId}`);
  } catch (e) {
    // console.log(e);
    return validationError({
      fieldErrors: {
        formError: "Server failed",
      },
    });
  }
};
