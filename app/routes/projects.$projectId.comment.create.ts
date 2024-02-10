import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { validator } from "~/core/components/Comments";
import { createComment } from "~/models/comment.server";
import { getSession, requireProfile } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId could not be found");
  const projectId = params.projectId;
  const profile = await requireProfile(request);
  const result = await validator.validate(await request.formData());

  if (result.error != undefined) return validationError(result.error);

  try {
    await createComment(
      projectId,
      profile.id,
      result.data.body,
      result.data.parentId
    );
  } catch (e) {
    const session = await getSession(request);
    session.flash("warning", "Error while saving comment");
  }
  return redirect(`/projects/${projectId}`);
};
