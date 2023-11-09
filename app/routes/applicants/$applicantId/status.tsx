/* eslint-disable no-console */
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "remix-typedjson";
import { editApplicant } from "~/models/applicant.server";
import { validator } from "~/routes/applicants/$applicantId";

export const action: ActionFunction = async ({ request, params }) => {
    // invariant(params.projectId, "applicantId could not be found");
    const result = await validator.validate(await request.formData());
    const applicantId = parseInt(result.data?.applicantId as string);
    const status = result.data?.status;
    let projectId = null;
    let mentorId = null;
    let response = null;
    if (status !== "DRAFT"){ 
      projectId = result.data?.project?.id ? result.data?.project.id  : result.data?.projectId;
      mentorId = result.data?.mentorId;
    } // else reset the values
    console.log("action",mentorId, projectId, status, applicantId);
   try{
      response = await editApplicant({mentorId, projectId, status}, applicantId);
   } catch (e) {
        throw e;
   }
   console.log("response",response.status);
   return redirect(`/applicants/${response.id}&status=${response.status}`);
  };