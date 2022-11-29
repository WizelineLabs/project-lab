import { FormControlLabel, Switch, Collapse } from "@mui/material"
import { useState } from "react"
import { MultiUrl } from "~/core/components/MultiUrl"
import DisciplinesSelect from "~/core/components/DisciplinesSelect"
import LabeledTextField from "~/core/components/LabeledTextField"
import LabeledTextFieldArea from "~/core/components/LabeledTextFieldArea"
import TextEditor from "~/core/components/TextEditor"
// import InputSelect from "~/core/components/InputSelect";
import SkillsSelect from "~/core/components/SkillsSelect"
import LabelsSelect from "~/core/components/LabelsSelect"
import ProjectOwnerField from "~/core/components/ProjectOwnerField"
import RelatedProjectsSelect from "~/core/components/RelatedProjectsSelect"
import ProjectMembersField from "~/core/components/ProjectMembersField"
import { useControlField } from "remix-validated-form"
import { Box } from "@mui/material"
import { useFormContext, useIsSubmitting } from "remix-validated-form"

export function ProjectForm({ projectformType }: any) {
  const [displayFields, setDisplayFields] = useState(projectformType === "create" ? false : true)
  const [helpWanted, setHelpWanted] = useControlField<boolean>("helpWanted")
  const isSubmitting = useIsSubmitting()
  const { isValid, fieldErrors } = useFormContext()
  console.log(fieldErrors)
  const disabled = isSubmitting || !isValid

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

      <TextEditor name="valueStatement" defaultValue={"Explain us your proposal..."} />

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
        {/* <DisciplinesSelect //this still uses constant values instead of values taken from the db
          name="disciplines"
          label="Looking for..."
        /> */}
      </Collapse>

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

      {projectformType !== "create" && (
        <ProjectOwnerField name="owner" label="Owner" owner={{ name: "John Doe" }} />
      )}

      <Collapse in={displayFields}>
        <LabeledTextField
          fullWidth
          style={{ margin: "1em 0" }}
          name="target"
          label="Who is your target user/client"
          placeholder="Millenials"
        />

        <MultiUrl
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

        {/* <SkillsSelect //this still uses constant values instead of values taken from the db
          name="skills"
          label="Skills"
        /> */}

        {/* <LabelsSelect //this still uses constant values instead of values taken from the db
          name="labels"
          label="Labels"
        /> */}

        {/* <RelatedProjectsSelect //this still uses constant values instead of values taken from the db
          thisProject=""
          name="relatedProjectsA"
          label="Related Projects"
        /> */}

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

        <ProjectMembersField name="projectMembers" label="Add a contributor" />
      </Collapse>

      <Box textAlign="center">
        <button disabled={disabled} type="submit" className="primary">
          {isSubmitting ? "Submitting..." : "Submit"}
        </button>
      </Box>
    </>
  )
}
