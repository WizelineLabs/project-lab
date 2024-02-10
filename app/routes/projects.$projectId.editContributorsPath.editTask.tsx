import { validationError } from "remix-validated-form";
import { taskValidator } from "./projects.$projectId.editContributorsPath";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import { createTask, updateTask } from "~/models/contributorsPath.server";

export const action: ActionFunction = async ({ request }) => {
  const result = await taskValidator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  try {
    if (result.data.id !== "") {
      await updateTask(result.data);
      return redirect(`..`);
    } else {
      await createTask(result.data);
      return redirect(`..`);
    }
  } catch (e) {
    throw e;
  }
};
