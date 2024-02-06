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
        name: z.object({ name: z.string() }).optional(),
        ids: z.array(z.union([z.string(), z.number()])),
    })
  );
    let result = await validatorBack.validate(await request.formData());
        if (result.error) return validationError(result.error);
        const ids = result.data.ids as string[];
        const tierName = result.data.name?.name;
  try {
    await updateManyProjects({ ids, data: { tierName } });
    return redirect("/manager/filter-tags/innovation-tiers");
  } catch (e) {
    throw e;
  }
};
const MergeTiers = () => {
  return (
    <>
    </>
  );
};

export default MergeTiers;