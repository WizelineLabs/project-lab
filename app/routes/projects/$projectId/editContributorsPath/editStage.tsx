import { Alert, Button, Container, Grid, Modal, Stack } from "@mui/material";
import {
  Link,
  useActionData,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import {
  ValidatedForm,
  validationError,
  useIsSubmitting,
} from "remix-validated-form";
import invariant from "tiny-invariant";
import { z } from "zod";
import { zfd } from "zod-form-data";
import LabeledTextField from "~/core/components/LabeledTextField";
import TextEditor from "~/core/components/TextEditor";
import { requireProfile, requireUser } from "~/session.server";
import type { ActionFunction } from "@remix-run/node";
import { redirect, json } from "@remix-run/node";
import { getProject } from "~/models/project.server";
import { isProjectMemberOrOwner } from "~/utils";
import { adminRoleName } from "~/constants";
import { updateStage } from "~/models/contributorsPath.server";

export const validator = withZod(
  zfd
    .formData({
      id: z.string().optional(),
      projectId: z.string(),
      position: zfd.numeric(),
      name: zfd.text(z.string().min(1)),
      criteria: zfd.text(z.string().optional()),
      mission: zfd.text(z.string().optional()),
    })
    .transform((val) => {
      return val;
    })
);

type ActionData = {
  errors?: {
    title?: string;
    body?: string;
  };
};

export const action: ActionFunction = async ({ request, params }) => {
  console.log("The form was posted");
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error)
  console.log("THE RESULT DATA", result);
  console.log("Will go back to Contributors path");
  
  
  try {
    if(result.data.id !== ''){
      console.log(`SAVE editable values for stage`)
      const stage = await updateStage(result.data);
    }
    return redirect(`..`);
  } catch (e) {
    throw e;
  }
};

export default function EditStagePage() {
  const navigate = useNavigate();

  function closeHandler() {
    navigate("..");
  }

  const [searchParams] = useSearchParams();
  const matches = useMatches();
  const params = useParams();

  const isSubmitting = useIsSubmitting("stageForm");
  const disabled = isSubmitting;

  // console.log(searchParams);
  // console.log(matches);
  // console.log(params);
  // console.log("--------------------------------");

  const projectId = params.projectId;
  const stageId = searchParams.get("id");
  const stagesData = matches.find(
    (match) => match.pathname === `/projects/${projectId}/editContributorsPath`
  )?.data.projectStages;

  // console.log(stagesData)
  const stageData = stagesData.find((stage: any) => stage.id === stageId);
  // console.log(stageData);
  const actionData = useActionData();
  return (
    <Modal open disableEscapeKeyDown onClose={closeHandler}>
      {/* Stage Edit form */}
      <Container>
        <Stack marginTop="2em" padding="2em 4em" bgcolor="white">
          <h2>Edit Stage</h2>
          <ValidatedForm
            id="stageForm"
            validator={validator}
            defaultValues={{
              id: stageData?.id || "",
              name: stageData?.name,
              criteria: stageData?.criteria,
              mission: stageData?.mission,
              projectId: stageData?.projectId,
              position: stageData?.position,
            }}
            method="post"
            // action="saveStage"
          >
            <Stack>
            <input type="hidden" name="id" value={stageData?.id}/>
            <input type="hidden" name="projectId"  value={stageData?.projectId}/>
            <input type="hidden" name="position"  value={stageData?.position}/>
            <LabeledTextField
              fullWidth
              name={`name`}
              label="Stage Name"
              placeholder="Stage Name"
            />
            <TextEditor
              name={`criteria`}
              label="Criteria"
              placeholder={"Explain the criteria..."}
            />
            <TextEditor
              name={`mission`}
              label="Mission"
              placeholder={"Explain the mission..."}
            />
              {JSON.stringify(actionData)}
{actionData && (
        <div>
          <h2>the info{actionData.title}</h2>
          <p>{actionData.description}</p>
        </div>
)}
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
              <Button type="submit" variant="contained" disabled={disabled}>
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
