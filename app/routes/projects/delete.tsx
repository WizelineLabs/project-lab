import type { ActionFunction } from "@remix-run/server-runtime";
import { deleteProject } from "~/models/project.server";
import { redirect } from "@remix-run/node";
import { requireUser } from "~/session.server";
import { adminRoleName } from "~/constants";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;
  let formData = await request.formData();
  let id: string = formData.get("projectId") as string;
  try {
    await deleteProject(id, isAdmin);
    return redirect("/projects");
  } catch (e) {
    throw e;
  }
};
export const DeleteProject = () => {
  return (
    <>
      <h1>delete</h1>
    </>
  );
};
