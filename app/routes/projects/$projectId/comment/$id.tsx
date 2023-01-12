import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import invariant from "tiny-invariant";
import { getSession, requireProfile, requireUser } from "~/session.server";
import { validator } from "~/core/components/Comments";
import {
  deleteComment,
  getComment,
  updateComment,
} from "~/models/comment.server";
import { adminRoleName } from "~/constants";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId could not be found");
  invariant(params.id, "comment id could not be found");
  const projectId = params.projectId;
  const id = params.id;

  try {
    const user = await requireUser(request);
    const profile = await requireProfile(request);
    const isAdmin = user.role == adminRoleName;
    const comment = await getComment(id);

    if (!isAdmin || comment.authorId != profile.id) {
      throw new Error("Edit/Delete comment not allowed");
    }

    if (request.method == "DELETE") {
      await deleteComment(id);
    } else {
      const result = await validator.validate(await request.formData());

      if (result.error != undefined) {
        // console.log(result.error.fieldErrors);
        throw new Error("Validation error");
      }

      await updateComment(id, result.data.body);
    }
  } catch (e) {
    // console.log(e);
    const session = await getSession(request);
    session.flash("warning", "Error while updating comment");
  }
  return redirect(`/projects/${projectId}`);
};
