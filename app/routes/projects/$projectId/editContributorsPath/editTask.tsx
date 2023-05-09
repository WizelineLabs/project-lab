import { Button } from "@mui/material";
import { Link, useMatches, useNavigate, useParams, useSearchParams } from "@remix-run/react";
import { ValidatedForm, validationError } from "remix-validated-form";
import TextEditor from "~/core/components/TextEditor";
import { taskValidator } from "../editContributorsPath";
import type { ActionFunction } from "@remix-run/server-runtime";
import { redirect, json } from "@remix-run/node";
import { createTask, updateTask } from "~/models/contributorsPath.server";

export const action: ActionFunction = async ({ request, params }) => {
  console.log("The form was posted");
  const result = await taskValidator.validate(await request.formData());
  if (result.error) return validationError(result.error)
  console.log("THE RESULT DATA", result);
  console.log("Will go back to Contributors path");
  
  
  try {
    if(result.data.id !== ''){
      console.log(`SAVE editable values for tasks`)
      const task = await updateTask(result.data);
      return redirect(`..`);
    }else{
      console.log("SAVE A NEW task")
      const task = await createTask(result.data);
      return redirect(`..`);
    }
  } catch (e) {
    throw e;
  }

  // return json<ActionData>(
  //   { errors: { body: "The information was sent to backend" } },
  //   { status: 400 }
  // );
  // invariant(params.projectId, "projectId could not be found");
  // const projectId = params.projectId;
  // // Validate permissions
  // const user = await requireUser(request);
  // const isAdmin = user.role == adminRoleName;
  // if (!isAdmin) {
  //   const profile = await requireProfile(request);
  //   const currentProject = await getProject({ id: projectId });
  //   const {
  //     projectMembers: currentMembers = [],
  //     ownerId: currentOwnerId = null,
  //   } = currentProject;
  //   isProjectMemberOrOwner(profile.id, currentMembers, currentOwnerId);
  // }

  // if (result.error) return validationError(result.error);
  // // const project = await updateProjects(projectId, result.data);
  // // return redirect(`/projects/${projectId}`);
  // return json<ActionData>(
  //   { errors: { body: "The information was sent to backend" } },
  //   { status: 400 }
  // );
};





export default function EditStagePage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  const [searchParams] = useSearchParams();
  const matches = useMatches();
  const params = useParams();


  const projectId = params.projectId;
  const stageId = searchParams.get("stageId");
  const taskId = searchParams.get("id");
  const stagesData = matches.find(
    (match) => match.pathname === `/projects/${projectId}/editContributorsPath`
  )?.data.projectStages;

  // console.log(stagesData)
  const stageData = stagesData.find((stage: any) => stage.id === stageId);
  const taskData = stageData.projectTasks.find((task:any) => task.id === taskId)

  return(
    <>
              <pre>{JSON.stringify(taskData, null, 4)}</pre>
    {/* <TextEditor
    name={`mission`}
    label="Mission"
    placeholder={"Explain the mission..."}
    />
    <Button>Submit</Button> */}
  <Link to="..">Cancel</Link>
    </>
  )
}
