import {
  FormControlLabel,
  Switch,
  Collapse,
  Stack,
  Button,
  Box,
} from "@mui/material";
import type { ProjectStatus } from "@prisma/client";
import { useState } from "react";
import { useControlField, useIsSubmitting } from "remix-validated-form";
import DisciplinesSelect from "~/core/components/DisciplinesSelect";
import InputSelect from "~/core/components/InputSelect";
import LabeledTextField from "~/core/components/LabeledTextField";
import LabeledTextFieldArea from "~/core/components/LabeledTextFieldArea";
import LabelsSelect from "~/core/components/LabelsSelect";
import { MultiUrl } from "~/core/components/MultiUrl";
import ProjectOwnerField from "~/core/components/ProjectOwnerField";
import SkillsSelect from "~/core/components/SkillsSelect";
import TextEditor from "~/core/components/TextEditor";
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
  const disabled = isSubmitting;

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

      <LabelsSelect name="labels" label="Labels" />

      {projectformType === "create" ? (
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
      ) : null}

      {projectformType !== "create" ? (
        <InputSelect valuesList={statuses || []} name="status" label="Status" />
      ) : null}

      {projectformType !== "create" ? (
        <InputSelect
          valuesList={tiers || []}
          name="tierName"
          label="Innovation Tier"
        />
      ) : null}

      {projectformType !== "create" ? (
        <ProjectOwnerField name="ownerId" label="Owner" />
      ) : null}

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

          <SkillsSelect name="skills" label="Skills" />

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
            <DisciplinesSelect name="disciplines" label="Looking for..." />
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
