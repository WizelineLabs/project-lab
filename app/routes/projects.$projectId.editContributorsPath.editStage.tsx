import { Button, Container, Grid, Modal, Stack } from "@mui/material";
import {
  Link,
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
import { z } from "zod";
import { zfd } from "zod-form-data";
import LabeledTextField from "~/core/components/LabeledTextField";
import TextEditor from "~/core/components/TextEditor";
import type { ActionFunction } from "@remix-run/node";
import { redirect } from "@remix-run/node";
import { updateStage } from "~/models/contributorsPath.server";

export const validator = withZod(
  zfd
    .formData({
      id: z.string().min(1),
      projectId: z.string().min(1),
      position: zfd.numeric(),
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
  if (result.error) return validationError(result.error)
  
  
  try {
    if(result.data.id !== ''){
      await updateStage(result.data);
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

  const projectId = params.projectId;
  const stageId = searchParams.get("id");
  const stagesData = matches.find(
    (match) => match.pathname === `/projects/${projectId}/editContributorsPath`
  )?.data.projectStages;

  const stageData = stagesData.find((stage: any) => stage.id === stageId);
  return (
    <Modal open disableEscapeKeyDown onClose={closeHandler}>
      <Container>
        <Stack marginTop="2em" padding="2em 4em" bgcolor={theme => theme.palette.background.default}>
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
            <Grid
              container
              mt={2}
              justifyContent="flex-end"
              alignItems="center"
              spacing={2}
            >
              <Grid item>
                <Link to="..">
                  <Button variant="contained">Cancel</Button>
                </Link>
              </Grid>
              <Grid item>
              <Button type="submit" variant="contained" disabled={disabled}>
                  {isSubmitting ? "Saving..." : "Save"}
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
