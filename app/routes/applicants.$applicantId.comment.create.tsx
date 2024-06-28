import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { validationError } from "remix-validated-form";
import invariant from "tiny-invariant";
import { validator } from "~/core/components/Comments";
import { getApplicantIdByEmail } from "~/models/applicant.server";
import { createComment } from "~/models/applicantComment.server";
import { getSession, requireProfile } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.applicantId, "applicantId could not be found");
  const profile = await requireProfile(request);
  const result = await validator.validate(await request.formData());
  const applicant = await getApplicantIdByEmail(params.applicantId);

  if (result.error != undefined) return validationError(result.error);

  try {
    await createComment(
      applicant.id,
      profile.id,
      result.data.body,
      result.data.parentId
    );
  } catch (e) {
    const session = await getSession(request);
    session.flash("warning", "Error while saving comment");
  }
  return redirect(`/applicants/${params.applicantId}`);
};
