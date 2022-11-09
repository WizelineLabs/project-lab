import { FormControlLabel, Switch, Collapse, Box } from "@mui/material";
import { useState } from "react";
import { useActionData, useTransition } from "@remix-run/react";
import { MultivalueInput } from "~/core/components/MultivalueInput";
import DisciplinesSelect from "~/core/components/DisciplineSelect";
import LabeledTextField from "~/core/components/LabeledTextField";
import LabeledTextFieldArea from "~/core/components/LabeledTextFieldArea";
import TextEditor from "~/core/components/TextEditor";
// import InputSelect from "~/core/components/InputSelect";
import SkillsSelect from "~/core/components/SkillsSelect";
import LabelsSelect from "~/core/components/LabelsSelect";
import ProjectOwnerField from "~/core/components/ProjectOwnerField";
import RelatedProjectsSelect from "~/core/components/RelatedProjectsSelect";
import ProjectMembersField from "~/core/components/ProjectMembersField";
import { withZod } from "@remix-validated-form/with-zod";
import { z } from "zod";
import { ValidatedForm } from "remix-validated-form";
import { zfd } from "zod-form-data";

export const validator = withZod(
  z
    .object({
      name: z.string().nonempty("Name is required"),
      description: z.string().nonempty("Description is required"),
      textEditor: z.optional(z.string()),
      helpWanted: z.optional(z.boolean()),
      disciplines: zfd.repeatable(z.array(z.string()).optional()),
      target: z.optional(z.string()),
      repoUrls: zfd.repeatable(z.array(z.string()).optional()),
      slackChannels: z.optional(z.string()),
      skills: zfd.repeatable(z.array(z.string()).optional()),
      labels: zfd.repeatable(z.array(z.string()).optional()),
      relatedProjects: zfd.repeatable(z.array(z.string()).optional()),
      projectMembers: zfd.repeatable(z.array(z.string()).optional()),
    })
    .transform((val) => {
      val.disciplines = val.disciplines?.filter((el) => el != "");
      val.repoUrls = val.repoUrls?.filter((el) => el != "");
      val.skills = val.skills?.filter((el) => el != "");
      val.labels = val.labels?.filter((el) => el != "");
      val.relatedProjects = val.relatedProjects?.filter((el) => el != "");
      val.projectMembers = val.projectMembers?.filter((el) => el != "");
      return val;
    })
);

export function ProjectForm({ projectformType }: any) {
  const [displayFields, setDisplayFields] = useState(
    projectformType === "create" ? false : true
  );

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  const data = useActionData();

  return (
    <ValidatedForm validator={validator} method="post">
      <LabeledTextField
        style={{ minHeight: "4em" }}
        fullWidth
        name="name"
        label="Name"
        placeholder="Name"
      />

      <LabeledTextFieldArea
        style={{ minHeight: "4em" }}
        fullWidth
        name="description"
        label="Problem Statement"
        placeholder="Problem statement"
      />

      <TextEditor
        name="textEditor"
        defaultValue={"Explain us your proposal..."}
      />

      <FormControlLabel
        control={<Switch color="primary" name="helpWanted" />}
        name="helpWanted"
        label="We need some help"
        labelPlacement="end"
      />

      <Collapse in={true}>
        <DisciplinesSelect //this still uses constant values instead of values taken from the db
          name="disciplines"
          label="Looking for..."
        />
      </Collapse>

      {projectformType === "create" && (
        <FormControlLabel
          value="1"
          control={
            <Switch
              color="primary"
              onChange={(e) => setDisplayFields(e.target.checked)}
            />
          }
          label="Add more details"
          labelPlacement="end"
        />
      )}

      {projectformType !== "create" && (
        <ProjectOwnerField
          name="owner"
          label="Owner"
          owner={{ name: "John Doe" }}
        />
      )}

      <Collapse in={displayFields}>
        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="target"
          label="Who is your target user/client"
          placeholder="Millenials"
        />

        <MultivalueInput
          name="repoUrls"
          label="Repo URLs"
          footer="Type the Repo URL and press Enter to add it to your project. You can add as many URLs as you need."
        />

        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="slackChannels"
          label="Slack Channel"
          placeholder="#project-name"
        />

        {/* {projectformType !== "create" && ( //this still uses constant values instead of values taken from the db
          <InputSelect
            valuesList={statuses}
            defaultValue=""
            name="projectStatus"
            label="Status"
            disabled={false}
            value={selectedStatus.name}
            handleChange={setSelectedStatus}
          />
        )} */}

        <SkillsSelect //this still uses constant values instead of values taken from the db
          name="skills"
          label="Skills"
        />

        <LabelsSelect //this still uses constant values instead of values taken from the db
          name="labels"
          label="Labels"
        />

        <RelatedProjectsSelect //this still uses constant values instead of values taken from the db
          thisProject=""
          name="relatedProjects"
          label="Related Projects"
        />

        {/* {projectformType !== "create" && (
          <InputSelect
            valuesList={tiers}
            name="innovationTiers"
            label="Innovation Tier"
            disabled={false}
            value={selectedTiers.name}
            handleChange={setSelectedTiers}
          />
        )} */}

        {/* <ProjectMembersField
          name="projectMembers"
          label="Add a contributor"
          handleChange={handleChangeProjectMembers}
          values={projectFields.projectMembers}
        /> */}
      </Collapse>
      <Box textAlign="center">
        <button type="submit" className="primary" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Project"}
        </button>
      </Box>
    </ValidatedForm>
  );
}
