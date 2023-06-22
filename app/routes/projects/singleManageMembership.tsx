import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/node";
import { validator } from "~/core/components/MembershipModal";
import { updateMembers } from "~/models/project.server";


export const action: ActionFunction = async ({ request }) => {
    const result = await validator.validate(await request.formData());
    const projectId = result.data?.projectId;
    const projectMembers = [{
      id: result.data?.id as string,
      profileId: result.data?.profileId as string,
      hoursPerWeek: result.data?.hoursPerWeek,
      role: result.data?.role,
      practicedSkills: result.data?.practicedSkills,
      active: result.data?.active as boolean
    }];

    try {
      await updateMembers(projectId as string, projectMembers);
      return redirect("/projects");
    } catch (e) {
      throw e;
    }
  };

const singleManageMembership = () => {
    return (
        <h1>update membership</h1>
    )
}

export default singleManageMembership;