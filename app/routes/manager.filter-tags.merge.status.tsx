import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import { withZod } from "@remix-validated-form/with-zod";
import { zfd } from "zod-form-data";
import { z } from "zod";
import { updateManyProjects } from "~/models/project.server";
import { validationError } from "remix-validated-form";



export const action: ActionFunction = async ({ request }) => {
  const validatorBack = withZod(
    zfd.formData({
      status: z.object({ name: z.string() }).optional(),
      ids: z.array(z.union([z.string(), z.number()])),
    })
  );
    let updateResult = await validatorBack.validate(await request.formData());
        if (updateResult.error) return validationError(updateResult.error);
        const ids = updateResult.data.ids as string[];
        const projectStatus = updateResult.data.status?.name;
  try {
    await updateManyProjects({ ids, data: { status: projectStatus } });
    return redirect("/manager/filter-tags/statuses");
  } catch (e) {
    throw e;
  }
};
const MergeStatus = () => {
  return (
    <>
    </>
  );
};

export default MergeStatus;