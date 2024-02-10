import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/server-runtime";
import { withZod } from "@remix-validated-form/with-zod";
import { validationError } from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import { updateManyProjects } from "~/models/project.server";

export const action: ActionFunction = async ({ request }) => {
  const validatorBack = withZod(
    zfd.formData({
      status: z.object({ name: z.string() }).optional(),
      ids: z.array(z.union([z.string(), z.number()])),
    })
  );
  const updateResult = await validatorBack.validate(await request.formData());
  if (updateResult.error) return validationError(updateResult.error);
  const ids = updateResult.data.ids as string[];
  const projectStatus = updateResult.data.status?.name;
  await updateManyProjects({ ids, data: { status: projectStatus } });
  return redirect("/manager/filter-tags/statuses");
};
const MergeStatus = () => {
  return <></>;
};

export default MergeStatus;
