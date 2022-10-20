import { FormControlLabel, Switch, Collapse, Box } from "@mui/material";
import { useState } from "react";
import { Form, useTransition } from "@remix-run/react";
import { MultivalueInput } from "~/core/components/MultivalueInput";
import { redirect } from "@remix-run/node";
import type { ActionFunction } from "@remix-run/node";
import DisciplinesSelect from "~/core/components/DisciplineSelect";
import LabeledTextField from "~/core/components/LabeledTextField";
import LabeledTextFieldArea from "~/core/components/LabeledTextFieldArea";
import TextEditor from "~/core/components/TextEditor";
import InputSelect from "~/core/components/InputSelect";
import SkillsSelect from "~/core/components/SkillsSelect";
import LabelsSelect from "~/core/components/LabelsSelect";
import ProjectOwnerField from "~/core/components/ProjectOwnerField";
import RelatedProjectsSelect from "~/core/components/RelatedProjectsSelect";
import ProjectMembersField from "~/core/components/ProjectMembersField";

export function ProjectForm({ projectformType }: any) {
  const [displayFields, setDisplayFields] = useState(
    projectformType === "create" ? false : true
  );
  const [helpWanted, setHelpWanted] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState({ name: "" });
  const [selectedTiers, setSelectedTiers] = useState({ name: "" });

  const handleDisplaySwitch = (e: any) => {
    console.log(`Change value of ${e.target.checked.toString()}`);
    setDisplayFields(!displayFields);
  };

  const handleHelpWanted = (e: any) => {
    console.log(`Change value of ${e.target.checked.toString()}`);
    setHelpWanted(!helpWanted);
  };

  const statuses = [
    { name: "Active" },
    { name: "Inactive" },
    { name: "Completed" },
  ];

  const tiers = [{ name: "0" }, { name: "1" }, { name: "2" }, { name: "3" }];

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  return (
    <Form method="post" action="/projects/create">
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
        control={<Switch color="primary" onChange={handleHelpWanted} />}
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
          name="slackChannel"
          label="Slack Channel"
          placeholder="#project-name"
        />

        {projectformType !== "create" && ( //this still uses constant values instead of values taken from the db
          <InputSelect
            valuesList={statuses}
            defaultValue=""
            name="projectStatus"
            label="Status"
            disabled={false}
            value={selectedStatus.name}
            handleChange={setSelectedStatus}
          />
        )}
        {/*
        <SkillsSelect //this still uses constant values instead of values taken from the db
        name="skills" label="Skills" />
        <LabelsSelect //this still uses constant values instead of values taken from the db
         name="labels" label="Labels" />
        <RelatedProjectsSelect //this still uses constant values instead of values taken from the db
          thisProject=""
          name="relatedProjects"
          label="Related Projects"
      /> 
        {projectformType !== "create" && (
          <InputSelect
            valuesList={tiers}
            name="innovationTiers"
            label="Innovation Tier"
            disabled={false}
            value={selectedTiers.name}
            handleChange={setSelectedTiers}
          />
        )}
        {<ProjectMembersField // this isn't finished
            name="projectMembers"
            label="Add a contributor"
        />} */}
      </Collapse>
      <Box textAlign="center">
        <button type="submit" className="primary" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Project"}
        </button>
      </Box>
    </Form>
  );
}
