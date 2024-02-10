import type { ActionFunction} from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { addAppliedProject } from "~/models/applicant.server";
import { getProjectById } from "~/models/project.server";
import { getSession, requireProfile } from "~/session.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId not found");

  const profile = await requireProfile(request);
  const projects = await getProjectById(params.projectId);

  try {
    await addAppliedProject(
      profile.email,
      projects.name,
      projects.id,
    );
  } catch (e) {
    const session = await getSession(request);
    session.flash("warning", "error while applying a project");
  }

  return redirect(`/internshipProjects/${projects.id}`);
};
