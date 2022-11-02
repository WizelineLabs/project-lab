import { FormControlLabel, Switch, Collapse, Box } from "@mui/material";
import { useState } from "react";
import { Form, useTransition } from "@remix-run/react";
import { MultivalueInput } from "~/core/components/MultivalueInput";
import { useFetcher } from "@remix-run/react";
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
  const fetcher = useFetcher();

  const [displayFields, setDisplayFields] = useState(
    projectformType === "create" ? false : true
  );

  const [projectFields, setProjectFields] = useState<projectFormType>({
    name: "",
    description: "",
    textEditor: "",
    valueStatement: "",
    helpWanted: false,
    disciplines: [],
    owner: "",
    target: "",
    repoUrls: [],
    slackChannel: "",
    projectStatus: "",
    skills: [],
    labels: [],
    relatedProjects: [],
    innovationTiers: [],
    projectMembers: {
      contributors: [],
      owner: "",
      roles: [],
      skills: [],
      hours: 0,
      active: false,
    },
  });

  type projectFormType = {
    name: string;
    description?: string;
    textEditor: string;
    valueStatement?: string;
    helpWanted?: boolean;
    disciplines: string[];
    owner?: string;
    target?: string;
    repoUrls: string[];
    slackChannel?: string;
    status?: string;
    tierName?: string;
    projectStatus: string;
    skills: string[];
    labels: string[];
    relatedProjects: string[];
    innovationTiers: string[];
    projectMembers: object;
  };

  const handleSubmit = async () => {
    const body = {
      data: JSON.stringify(projectFields),
    };

    await fetcher.submit(body, { method: "post" });
  };

  const transition = useTransition();
  const isCreating = Boolean(transition.submission);

  const handleChange = ({ name, newValue }) => {
    setProjectFields((prev: any) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  const handleChangeProjectMembers = ({ name, newValue }) => {
    setProjectFields((prev: any) => ({
      ...prev,
      projectMembers: { ...prev.projectMembers, [name]: newValue },
    }));
  };

  return (
    <form action="/projects/create" onSubmit={async () => await handleSubmit()}>
      <LabeledTextField
        style={{ minHeight: "4em" }}
        fullWidth
        name="name"
        label="Name"
        placeholder="Name"
        handleChange={handleChange}
      />

      <LabeledTextFieldArea
        style={{ minHeight: "4em" }}
        fullWidth
        name="description"
        label="Problem Statement"
        placeholder="Problem statement"
        handleChange={handleChange}
      />

      <TextEditor
        name="textEditor"
        defaultValue={"Explain us your proposal..."}
        handleChange={handleChange}
      />

      <FormControlLabel
        control={
          <Switch
            color="primary"
            onChange={(e) =>
              handleChange({ name: "helpWanted", newValue: e.target.checked })
            }
          />
        }
        name="helpWanted"
        label="We need some help"
        labelPlacement="end"
      />

      <Collapse in={projectFields.helpWanted}>
        <DisciplinesSelect //this still uses constant values instead of values taken from the db
          name="disciplines"
          label="Looking for..."
          handleChange={handleChange}
          values={projectFields.disciplines}
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
          handleChange={handleChange}
        />
      )}

      <Collapse in={displayFields}>
        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="target"
          label="Who is your target user/client"
          placeholder="Millenials"
          handleChange={handleChange}
        />

        <MultivalueInput
          name="repoUrls"
          label="Repo URLs"
          footer="Type the Repo URL and press Enter to add it to your project. You can add as many URLs as you need."
          handleChange={handleChange}
          values={projectFields.repoUrls}
        />

        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="slackChannel"
          label="Slack Channel"
          placeholder="#project-name"
          handleChange={handleChange}
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
          handleChange={handleChange}
          values={projectFields.skills}
        />

        <LabelsSelect //this still uses constant values instead of values taken from the db
          name="labels"
          label="Labels"
          handleChange={handleChange}
          values={projectFields.labels}
        />

        <RelatedProjectsSelect //this still uses constant values instead of values taken from the db
          thisProject=""
          name="relatedProjects"
          label="Related Projects"
          handleChange={handleChange}
          values={projectFields.relatedProjects}
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

        <ProjectMembersField
          name="projectMembers"
          label="Add a contributor"
          handleChange={handleChangeProjectMembers}
          values={projectFields.projectMembers}
        />
      </Collapse>
      <Box textAlign="center">
        <button type="submit" className="primary" disabled={isCreating}>
          {isCreating ? "Creating..." : "Create Project"}
        </button>
      </Box>
    </form>
  );
}
