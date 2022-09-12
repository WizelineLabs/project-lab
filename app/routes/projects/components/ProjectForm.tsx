import { FormControlLabel, Switch, Collapse } from "@mui/material";
import { Form } from "@remix-run/react";
import LabeledTextField from "~/core/components/LabeledTextField";
import LabeledTextFieldArea from "~/core/components/LabeledTextFieldArea";
import LabeledSwitchField from "~/core/components/LabeledSwitchField";
export function ProjectForm() {
  return (
    <form method="post">
      <LabeledTextField fullWidth name="name" label="Name" placeholder="Name" />

      <LabeledTextFieldArea
        style={{ minHeight: "4em" }}
        fullWidth
        name="description"
        label="Problem Statement"
        placeholder="Problem statement"
      />
      
      {/* <TextEditor
          initialValues={initialValues}
          name="valueStatement"
          label="Your proposal"
          placeholder="Explain us your proposal..."
      /> */}

      <LabeledSwitchField
        name="helpWanted"
        label="We need some help"
        initialValues={false}
      />

      {/* <DisciplinesSelect
        name="disciplines"
        label="Looking for..."
        parentName="helpWanted"
      /> */}

      {/*
        {projectformType === "create" && (
          <FormControlLabel
            value="1"
            control={<Switch color="primary" onChange={handleDisplaySwitch} />}
            label="Add more details"
            labelPlacement="end"
          />
        )}
        {projectformType !== "create" && (
          <ProjectOwnerField
            name="owner"
            label="Owner"
            owner={getOwner(initialValues)}
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
          <MultiValueField
            name="repoUrls"
            label="Repo URLs"
            footer="Type the Repo URL and press Enter to add it to your project. You can add as many URLs as you need."
          />
          <LabeledTextField
            fullWidth
            style={{ margin: "1em 0" }}
            name="slackChannel"
            label="Slack Channel"
            placeholder="#project-name"
          />
          {projectformType !== "create" && (
            <InputSelect
              valuesList={statuses}
              defaultValue={defaultStatus}
              name="projectStatus"
              label="Status"
            />
          )}
          <SkillsSelect name="skills" label="Skills" />
          <LabelsSelect name="labels" label="Labels" />
          <RelatedProjectsSelect
            thisProject={initialValues?.id ? initialValues?.id : ""}
            name="relatedProjects"
            label="Related Projects"
          />
          {projectformType !== "create" && (
            <InputSelect
              valuesList={tiers}
              name="innovationTiers"
              label="Innovation Tier"
              disabled={user?.role !== adminRoleName}
            />
          )}
          <ProjectMembersField
            name="projectMembers"
            label="Add a contributor"
          />
        </Collapse> */}
    </form>
  );
}


