import { Button, Container, Grid, Modal, Stack } from "@mui/material";
import type { LoaderArgs, ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import {
  Link,
  useMatches,
  useNavigate,
  useParams,
  useSearchParams,
} from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";

import { typedjson, useTypedLoaderData } from "remix-typedjson";
import {
  ValidatedForm,
  useIsSubmitting,
  validationError,
} from "remix-validated-form";
import { z } from "zod";
import LabeledTextField from "~/core/components/LabeledTextField";
import {
  deleteStage,
  updateStagePosition,
} from "~/models/contributorsPath.server";

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

export const validator = withZod(
  z
    .object({
      id: z.string(),
      projectId: z.string(),
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

export const action: ActionFunction = async ({ request }) => {
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  try {
    if (result.data.id !== "") {
      const stageId = result.data.id;
      const projectId = result.data.projectId;
      await deleteStage(stageId);
      await updateStagePosition(projectId);
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

  const projectId = params.projectId;
  const stageId = searchParams.get("id");
  const stagesData = matches.find(
    (match) => match.pathname === `/projects/${projectId}/editContributorsPath`
  )?.data.projectStages;
  const stageData = stagesData.find((stage: any) => stage.id === stageId);

  return (
    <Modal open disableEscapeKeyDown onClose={closeHandler}>
      <Container>
        <Stack marginTop="2em" padding="2em 4em" bgcolor="white">
          <h2>Delete Stage</h2>
          <p>Are you sure you want to delete this stage?</p>
          <h1>{stageData.name}</h1>
          <ValidatedForm
            validator={validator}
            defaultValues={{
              id: stageId || "",
              confirmationInput: "",
              confirmationString: confirmationString,
            }}
            method="post"
            action=""
          >
            <Stack>
              <p>{confirmationString}</p>
              <input type="hidden" name="id" value={stageId ? stageId : ""} />
              <input type="hidden" name="projectId" value={projectId} />
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
        </Stack>
      </Container>
    </Modal>
  );
}
