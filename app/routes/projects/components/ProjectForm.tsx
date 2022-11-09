import { FormControlLabel, Switch, Collapse, Box } from "@mui/material";
import { useState } from "react";
import { useTransition } from "@remix-run/react";
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

export function ProjectForm({ projectformType }: any) {
  const [displayFields, setDisplayFields] = useState(
    projectformType === "create" ? false : true
  );
  const [displayDisciplines, setDisplayDisciplines] = useState(false);

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  return (
    <>
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
        control={
          <Switch
            color="primary"
            name="helpWanted"
            onChange={(e) => setDisplayDisciplines(e.target.checked)}
          />
        }
        name="helpWanted"
        label="We need some help"
        labelPlacement="end"
      />

      <Collapse in={displayDisciplines}>
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
    </>
  );
}
