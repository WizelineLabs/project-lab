import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { requireProfile, requireUser } from "~/session.server";
import { archiveProject } from "~/models/project.server";
import { adminRoleName } from "~/constants";

export const action: ActionFunction = async ({ request }) => {
  let formData = await request.formData();
  let projectId: string = formData.get("projectId") as string;
  const profile = await requireProfile(request);
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;

  try {
    await archiveProject(projectId, profile.id, isAdmin);
    return redirect(`/projects/${projectId}`);
  } catch (e) {
    console.log(e);
  }
};
