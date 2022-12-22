import type { ActionFunction } from "@remix-run/server-runtime";
import { deleteProject } from "~/models/project.server";
import { requireProfile } from "~/session.server";
import { redirect } from "@remix-run/node";

export const action: ActionFunction = async ({ request }) => {
  const profile = await requireProfile(request);
  let formData = await request.formData();
  let id: string = formData.get("projectId");
  console.log("result", id);

  try {
    await deleteProject(id, profile.id);
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
