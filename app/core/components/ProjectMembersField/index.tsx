import React from "react"
import { Autocomplete, Checkbox, Chip, FormControlLabel, Grid, TextField } from "@mui/material"
import { SkillsSelect } from "app/core/components/SkillsSelect"
import { DisciplinesSelect } from "~/core/components/DisciplinesSelect"
import { useField, useControlField } from "remix-validated-form"
import LabeledTextField from "../LabeledTextField"
import { useLoaderData } from "@remix-run/react"

interface ProfilesSelectProps {
  name: string
  label: string
  helperText?: string
}
interface ProjectMembers {
  profileId: string
  name: string
  roles: string[]
  skills: string[]
  hours: string
  active: boolean
}

export const ProjectMembersField = ({ name, label, helperText }: ProfilesSelectProps) => {
  const { profile } = useLoaderData()

  const { error } = useField(name)

  const [items, setItems] = useControlField<ProjectMembers[]>(name)

  const profiles: readonly any[] = [
    { id: "03a87185-0972-4329-8fcc-e665b7b88874", name: "Joaquin" },
    { id: "0de348b1-cff5-42d2-8786-abef6ed66c2a", name: "Juan" },
    { id: "12fd45b0-0d43-43a0-881c-445fa0bf1da1", name: "Diego Mojarro Tapia" },
    { id: "135c2bcf-5a75-41e9-84b8-2b1ca4261d94", name: "Andres Refugio" },
  ]

  return (
    <React.Fragment>
      <Autocomplete
        multiple
        options={profiles}
        getOptionLabel={(option) => option.name}
        value={items}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        disableClearable
        onChange={(_event, _newValue, reason, details) => {
          if (reason === "selectOption") {
            setItems(
              items.concat({
                profileId: details?.option.id,
                name: details?.option.name,
                roles: [],
                skills: [],
                hours: "",
                active: false,
              })
            )
          }
          if (reason === "removeOption" && profile.name !== details?.option.name) {
            setItems(items.filter((item) => item.name !== details?.option.name))
          }
        }}
        renderTags={() => null}
        renderInput={(params) => (
          <TextField {...params} label={label} error={!!error} helperText={error || helperText} />
        )}
      />

      <Grid
        container
        spacing={1}
        alignItems="baseline"
        rowSpacing={{ xs: 2, sm: 1 }}
        style={{ paddingTop: 20 }}
      >
        {items?.map((item, i) => (
          <React.Fragment key={i}>
            <Grid item xs={12} sm={2}>
              <>
                <input type="hidden" name={`${name}[${i}].profileId`} value={item.profileId} />
                <Chip
                  label={item.name}
                  onDelete={() => {
                    if (item.name !== profile.name) {
                      setItems(items.filter((_, index) => index !== i))
                    }
                  }}
                />
              </>
            </Grid>
            <Grid item xs={12} sm={4}>
              {/* <DisciplinesSelect //still uses constant values instead of values taken from the db
                name={`${name}[${i}].roles`}
                label="Looking for..."
              /> */}
            </Grid>
            <Grid item xs={12} sm={4}>
              {/* <SkillsSelect //still uses constant values instead of values taken from the db
                name={`${name}[${i}].skills`}
                label="Skills"
              /> */}
            </Grid>
            <Grid item xs={6} sm={1}>
              <LabeledTextField
                label="Hours"
                helperText="H. per week"
                name={`${name}[${i}].hours`}
                size="small"
                type="number"
                sx={{
                  "& .MuiFormHelperText-root": {
                    marginLeft: 0,
                    marginRight: 0,
                    textAlign: "center",
                  },
                }}
              />
            </Grid>
            <Grid item xs={2} sm={1} style={{ textAlign: "center" }}>
              <FormControlLabel
                control={
                  <Checkbox
                    name={`${name}[${i}].active`}
                    checked={item.active}
                    onChange={(e) => {
                      setItems(
                        items.map((item, index) =>
                          index === i
                            ? {
                                ...item,
                                active: e.target.checked,
                              }
                            : item
                        )
                      )
                    }}
                  />
                }
                label="Active"
              />
            </Grid>
            <hr className="rows__separator" />
          </React.Fragment>
        ))}
      </Grid>
    </React.Fragment>
  )
}
export default ProjectMembersField
