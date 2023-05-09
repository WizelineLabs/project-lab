import { Button, Container, Grid, Modal, Stack } from "@mui/material";
import type { LoaderArgs, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Link,
  useActionData,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import Markdown from "marked-react";
import { typedjson, useTypedLoaderData } from "remix-typedjson";
import {
  ValidatedForm,
  useIsSubmitting,
  validationError,
} from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import LabeledTextField from "~/core/components/LabeledTextField";
import { deleteTask, updateTaskPosition } from "~/models/contributorsPath.server";

const generateRandomNumberString = () => {
  let result = "";
  for (let i = 0; i < 6; i++) {
    result += Math.floor(Math.random() * 10);
  }
  return result;
};

export const loader = async ({ request, params }: LoaderArgs) => {
  const confirmationString = generateRandomNumberString();

  return typedjson({
    confirmationString,
  });
};

// const confirmationString = generateRandomNumberString();

// export const validator = withZod(
//   zfd
//     .formData({
//       id: z.string(),
//       // confirmationInput: z.string().refine((i) => i === confirmationString, {message: "Please fill the confirmation code"})
//       confirmationString: z.string(),
//       confirmationInput: z.string()
//     })
//     .transform((val) => {
//       return val;
//     })
//     .refine(({confirmationString,confirmationInput}) => confirmationInput === confirmationString,
//     {
//       path: ["confirmationInput"],
//       message: "Please write the confirmation code to proceed"
//     })
//     )
// ;

export const validator = withZod(
  z
    .object({
      id: z.string(),
      projectStageId: z.string(),
      confirmationString: z.string(),
      confirmationInput: z.string(),
    })
    .refine(
      ({ confirmationString, confirmationInput }) =>
        confirmationInput === confirmationString,
      {
        path: ["confirmationInput"],
        message: "Please write the confirmation code to proceed",
      }
    )
    .transform((val) => {
      return val;
    })
);

export const action: ActionFunction = async ({ request, params }) => {
  console.log("Delete form was posted");
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);
  console.log("THE RESULT DATA", result);

  try {
    if(result.data.id !== ''){
      const taskId = result.data.id
      const stageId = result.data.projectStageId
    //   console.log(`SAVE editable values for stage`)
    //   const stage = await updateStage(result.data);
    console.log("Value will be deleted");
    await deleteTask(taskId)
    const changedPositions =  await updateTaskPosition(stageId)
    console.log(changedPositions)
    console.log("Will go back to Contributors path");
    return redirect(`..`);
    }
  } catch (e) {
    throw e;
  }
};

export default function DeleteTaskPage() {
  const { confirmationString } = useTypedLoaderData<typeof loader>();
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }


  const [searchParams] = useSearchParams();
  const matches = useMatches();
  const params = useParams();

  const isSubmitting = useIsSubmitting("taskForm");
  const disabled = isSubmitting;

  // console.log(searchParams);
  // console.log("{{{{{{{{--------------------------------}}}}}}}}");
  // console.log(matches);
  // console.log(params);
  // console.log("--------------------------------");

  const projectId = params.projectId;
  const stageId = searchParams.get("stageId");
  const taskId = searchParams.get("id");
  const stagesData = matches.find(
    (match) => match.pathname === `/projects/${projectId}/editContributorsPath`
  )?.data.projectStages;
  console.dir(taskId);
  console.dir(stageId);
  const stageData = stagesData.find((stage: any) => stage.id === stageId);
  console.log(stageData);
  const taskData = stageData.projectTasks.find(
    (task: any) => task.id === taskId
  );
  console.log(taskData);
  const actionData = useActionData();
  
  return (
    <Modal open disableEscapeKeyDown onClose={closeHandler}>
      <Container>
        <Stack marginTop="2em" padding="2em 4em" bgcolor="white">
          <h2>Delete Task</h2>
          <p>Are you sure you want to delete this task?</p>
          <Markdown>{taskData.description}</Markdown>
          <ValidatedForm
            validator={validator}
            defaultValues={{
              id: taskData.id,
              confirmationInput: "",
              confirmationString: confirmationString,
            }}
            method="post"
            action=""
          >
            <Stack>
              <p>{confirmationString}</p>
              <input type="hidden" name="id" value={taskData.id} />
              <input type="hidden" name="projectStageId" value={taskData.projectStageId} />
              <input
                type="hidden"
                name="confirmationString"
                value={confirmationString}
                readOnly
              />
              <Grid></Grid>
              <LabeledTextField
                fullWidth
                name={`confirmationInput`}
                label="Confirmation code"
                placeholder=""
              />
              {/* {JSON.stringify(actionData)}
              {actionData && (
                <div>
                  <h2>the info{actionData.title}</h2>
                  <p>{actionData.description}</p>
                </div>
              )} */}
              <Grid
                container
                mt={2}
                justifyContent="flex-end"
                alignItems="center"
                spacing={2}
              >
                <Grid item>
                  <Link to="..">
                    <Button variant="contained">cancel</Button>
                  </Link>
                </Grid>
                <Grid item>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={disabled}
                  >
                    {isSubmitting ? "Submitting..." : "Submit"}
                  </Button>
                </Grid>
              </Grid>
            </Stack>
          </ValidatedForm>

          {/* <form action="" method="post"> */}
          {/* <ValidatedForm method="post" validator={validator}>
                <input type="text" name="test" />
                <Button type="submit" variant="contained" disabled={disabled}>
                  TEST SEND
                </Button>
            </ValidatedForm> */}
          {/* </form> */}
        </Stack>
      </Container>
    </Modal>
  );
}
