import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/server-runtime";
import { adminRoleName } from "~/constants";
import { deleteProject } from "~/models/project.server";
import { requireUser } from "~/session.server";

export const action: ActionFunction = async ({ request }) => {
  const user = await requireUser(request);
  const isAdmin = user.role == adminRoleName;
  const formData = await request.formData();
  const id: string = formData.get("projectId") as string;
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
