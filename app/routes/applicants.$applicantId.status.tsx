/* eslint-disable no-console */
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "remix-typedjson";
import { editApplicant, getApplicantById } from "~/models/applicant.server";
import { validator } from "~/routes/applicants.$applicantId._index";
import { requireProfile, requireUser } from "~/session.server";
import invariant from "tiny-invariant";
import { checkPermission } from "~/models/authorization.server";
import type { Roles } from "~/models/authorization.server";

export const action: ActionFunction = async ({ params, request }) => {
  const profile = await requireProfile(request);
  const user = await requireUser(request);
  invariant(params.applicantId, "applicantId could not be found");
  const applicant = await getApplicantById(params.applicantId);
  if (!applicant) {
    throw new Response("Not Found", { status: 404 });
  }
  const canEditProject = checkPermission(
    profile.id,
    user.role as Roles,
    "edit.project",
    "applicant",
    applicant
  );
  if (!canEditProject) {
    throw new Response("Unauthorized", { status: 401 });
  }



  const result = await validator.validate(await request.formData());
  const applicantId = parseInt(result.data?.applicantId as string);
  const status = result.data?.status;
  const response = await editApplicant(
    {
      mentorId: result.data?.mentor?.id,
      projectId: result.data?.project?.id,
      updatedBy: profile.id,
      status,
    },
    applicantId
  );
  return redirect(`/applicants/${response.id}?status=${response.status}`);
};
