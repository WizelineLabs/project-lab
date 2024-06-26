import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { validator } from "~/core/components/Comments";
import { deleteComment, updateComment } from "~/models/applicantComment.server";
import { getSession } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.applicantId, "applicant could not be found");
  invariant(params.id, "comment id could not be found");
  const id = params.id;

  try {
    if (request.method === "DELETE") {
      await deleteComment(id);
    } else {
      const result = await validator.validate(await request.formData());

      if (result.error != undefined) {
        throw new Error("Validation error");
      }

      await updateComment(id, result.data?.body);
    }
  } catch (e) {
    const session = await getSession(request);
    session.flash("warning", "Error while updating comment");
  }
  return redirect(`/applicants/${params.applicantId}`);
};
