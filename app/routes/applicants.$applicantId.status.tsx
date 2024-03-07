/* eslint-disable no-console */
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "remix-typedjson";
import { editApplicant } from "~/models/applicant.server";
import { validator } from "~/routes/applicants.$applicantId._index";

export const action: ActionFunction = async ({ request }) => {
  // invariant(params.projectId, "applicantId could not be found");
  const result = await validator.validate(await request.formData());
  const applicantId = parseInt(result.data?.applicantId as string);
  const status = result.data?.status;
  const response = await editApplicant(
    {
      mentorId: result.data?.mentor?.id,
      projectId: result.data?.project?.id,
      status,
    },
    applicantId
  );
  return redirect(`/applicants/${response.id}?status=${response.status}`);
};
