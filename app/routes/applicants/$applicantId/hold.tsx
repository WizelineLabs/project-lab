import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect } from "remix-typedjson";
import invariant from "tiny-invariant";
import { editApplicant } from "~/models/applicant.server";
import { validator } from "~/routes/applicants/$applicantId";


export const action: ActionFunction = async ({ request, params }) => {
    // invariant(params.projectId, "applicantId could not be found");
    const result = await validator.validate(await request.formData());
    const applicantId = parseInt(result.data?.applicantId as string);
    const projectId = result.data?.project?.id ? result.data?.project.id  : result.data?.projectId;
    const mentorId = result.data?.mentorId;
    const status = result.data?.status;
   try{
       await editApplicant({mentorId, projectId, status}, applicantId);
   } catch (e) {
        throw e;
   }
  
    return redirect(`/applicants/${applicantId}`);
  };


export default function holdIntern(){

}