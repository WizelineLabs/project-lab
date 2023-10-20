import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "@remix-run/server-runtime";
import invariant from "tiny-invariant";
import { addAppliedProject } from "~/models/applicant.server";
import { getProjectById } from "~/models/project.server";
import { getSession, requireProfile } from "~/session.server";
import { sendEmail } from "~/models/mailer.server";
import { mentorDiscipline } from "~/constants";
import { getProfileEmailById } from "~/models/profile.server";
import {
  searchDisciplineByName,
  getProfileIdByDiscipline,
} from "~/models/discipline.server";

export const action: ActionFunction = async ({ request, params }) => {
  invariant(params.projectId, "projectId not found");

  const profile = await requireProfile(request);
  const projects = await getProjectById(params.projectId);
  const projectId = await projects.id;
  const id = await searchDisciplineByName(mentorDiscipline);
  const idByDiscipline = await getProfileIdByDiscipline(id?.id as string);
  const emailByDiscipline = await getProfileEmailById(idByDiscipline);
  sendEmail(
    emailByDiscipline,
    projects?.name as string,
    profile?.name as string
  );

  try {
    await addAppliedProject(profile.email, projects.name, projectId);
  } catch (e) {
    const session = await getSession(request);
    session.flash("warning", "error while applying a project");
  }

  return redirect("/internshipProjects");
};
