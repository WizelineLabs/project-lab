import {
  FormControlLabel,
  Switch,
  Collapse,
  Stack,
  Button,
} from "@mui/material";
import { useState } from "react";
import { MultiUrl } from "~/core/components/MultiUrl";
import DisciplinesSelect from "~/core/components/DisciplinesSelect";
import LabeledTextField from "~/core/components/LabeledTextField";
import LabeledTextFieldArea from "~/core/components/LabeledTextFieldArea";
import TextEditor from "~/core/components/TextEditor";
import InputSelect from "~/core/components/InputSelect";
import SkillsSelect from "~/core/components/SkillsSelect";
import LabelsSelect from "~/core/components/LabelsSelect";
import ProjectOwnerField from "~/core/components/ProjectOwnerField";
import { useControlField } from "remix-validated-form";
import { Box } from "@mui/material";
import { useFormContext, useIsSubmitting } from "remix-validated-form";
import type { ProjectStatus } from "@prisma/client";
import type { getInnovationTiers } from "~/models/innovationTier.server";

export function ProjectForm({
  projectformType,
  statuses,
  tiers,
}: {
  projectformType?: "create" | undefined;
  statuses?: ProjectStatus[];
  tiers?: Awaited<ReturnType<typeof getInnovationTiers>>;
}) {
  const [displayFields, setDisplayFields] = useState(
    projectformType === "create" ? false : true
  );
  const [helpWanted, setHelpWanted] = useControlField<boolean>("helpWanted");
  const isSubmitting = useIsSubmitting();
  const { isValid } = useFormContext();
  const disabled = isSubmitting;
  if (!isValid) {
    // console.log(fieldErrors);
    // console.log(getValues());
  }

  return (
    <Stack spacing={2}>
      <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />

      <LabeledTextFieldArea
        fullWidth
        name="description"
        label="Problem Statement"
        placeholder="Problem statement"
      />

      <TextEditor
        name="valueStatement"
        label="Value proposition"
        placeholder={"Explain us your proposal..."}
      />

      <LabelsSelect //this still uses constant values instead of values taken from the db
        name="labels"
        label="Labels"
      />

      {projectformType === "create" && (
        <FormControlLabel
          value="1"
          control={
            <Switch
              color="primary"
              name="displayFields"
              onChange={(e) => setDisplayFields(e.target.checked)}
            />
          }
          label="Add more details"
          labelPlacement="end"
        />
      )}

      {projectformType !== "create" && ( //this still uses constant values instead of values taken from the db
        <InputSelect
          valuesList={statuses || []}
          name="projectStatus"
          label="Status"
        />
      )}

      {projectformType !== "create" && ( //this still uses constant values instead of values taken from the db
        <InputSelect
          valuesList={tiers || []}
          name="innovationTiers"
          label="Innovation Tier"
        />
      )}

      {projectformType !== "create" && (
        <ProjectOwnerField name="owner" label="Owner" />
      )}

      <Collapse in={displayFields}>
        <Stack spacing={2}>
          <LabeledTextField
            fullWidth
            name="target"
            label="Who is your target user/client"
            placeholder="Millenials"
          />

          <MultiUrl
            name="repoUrls"
            label="Repo URLs"
            footer="* Type the Repo URL and press Enter to add it to your project. You can add as many URLs as you need."
          />

          <LabeledTextField
            fullWidth
            name="slackChannel"
            label="Slack Channel"
            placeholder="#project-name"
          />

          <LabeledTextField
            fullWidth
            name="projectBoard"
            label="Project Board"
            placeholder="Type the link to your board to add it to your project."
          />

          <SkillsSelect //this still uses constant values instead of values taken from the db
            name="skills"
            label="Skills"
          />

          <FormControlLabel
            control={
              <Switch
                color="primary"
                name="helpWanted"
                checked={helpWanted}
                onChange={(e) => setHelpWanted(e.target.checked)}
              />
            }
            name="helpWanted"
            label="We need some help"
            labelPlacement="end"
          />

          <Collapse in={helpWanted}>
            <DisciplinesSelect //this still uses constant values instead of values taken from the db
              name="disciplines"
              label="Looking for..."
            />
          </Collapse>
        </Stack>
      </Collapse>
      <Box textAlign="center">
        <Button type="submit" disabled={disabled} variant="contained">
          {isSubmitting ? "Submitting..." : "Submit"}
        </Button>
      </Box>
    </Stack>
  );
}
