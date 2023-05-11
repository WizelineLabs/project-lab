import { Button, Container, Grid, Modal, Stack } from "@mui/material";
import { Link, useNavigate, useParams } from "@remix-run/react";
import { withZod } from "@remix-validated-form/with-zod";
import {
  ValidatedForm,
  validationError,
  useIsSubmitting,
} from "remix-validated-form";
import { z } from "zod";
import { zfd } from "zod-form-data";
import LabeledTextField from "~/core/components/LabeledTextField";
import TextEditor from "~/core/components/TextEditor";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { createStage } from "~/models/contributorsPath.server";

export const validator = withZod(
  zfd
    .formData({
      projectId: z.string(),
      name: zfd.text(z.string().min(1)),
      criteria: zfd.text(z.string().min(1)),
      mission: zfd.text(z.string().min(1)),
    })
    .transform((val) => {
      return val;
    })
);

export const action: ActionFunction = async ({ request, params }) => {
  const result = await validator.validate(await request.formData());
  if (result.error) return validationError(result.error);

  try {
    await createStage(result.data);
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

  const params = useParams();
  const projectId = params.projectId;

  const isSubmitting = useIsSubmitting("stageForm");
  const disabled = isSubmitting;

  return (
    <Modal open disableEscapeKeyDown onClose={closeHandler}>
      <Container>
        <Stack marginTop="2em" padding="2em 4em" bgcolor="white">
          <h2>Create Stage</h2>
          <ValidatedForm
            id="stageForm"
            validator={validator}
            defaultValues={{
              name: "",
              criteria: "",
              mission: "",
              projectId: projectId,
            }}
            method="post"
          >
            <Stack>
              <input type="text" name="projectId" value={projectId} />
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
