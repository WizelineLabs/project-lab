import { redirect, type ActionFunction } from "@remix-run/server-runtime";
import { hasCheckMembership } from "~/cookies";
import { multipleProjectsValidator } from "~/core/components/MembershipModal";
import { updateProjectActivity } from "~/models/project.server";

export const action: ActionFunction = async ({ request }) => {
  const result = await multipleProjectsValidator.validate(
    await request.formData()
  );
  const projects = result.data?.projects;
  if (projects) {
    await updateProjectActivity(projects);
    return redirect("/projects", {
      headers: {
        "Set-Cookie": await hasCheckMembership.serialize({}),
      },
    });
  } else {
    throw console.error("Empty data for projects");
  }
};

const manageMembership = () => {
  return <h1>update membership</h1>;
};

export default manageMembership;
