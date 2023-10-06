import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getSession, requireProfile } from "~/session.server";
import { validator } from "~/core/components/Comments";
import { validationError } from "remix-validated-form";
import { createComment } from "~/models/applicantComment.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.applicantId, "applicantId could not be found");
  const applicantId = params.applicantId;
  const profile = await requireProfile(request);
  const result = await validator.validate(await request.formData());

  if (result.error != undefined) return validationError(result.error);

  try {
    await createComment(
      parseInt(applicantId as string),
      profile.id,
      result.data.body,
      result.data.parentId
    );
  } catch (e) {
    const session = await getSession(request);
    session.flash("warning", "Error while saving comment");
  }
  return redirect(`/applicants/${applicantId}`);
};
