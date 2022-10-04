import React, { Fragment, useState } from "react"
import {
  Autocomplete,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material"
import { SkillsSelect } from "app/core/components/SkillsSelect"
import { DisciplinesSelect } from "app/core/components/DisciplineSelect"

interface ProfilesSelectProps {
  name: string;
  label: string;
  helperText?: string;
}

export const ProjectMembersField = ({
  name,
  label,
  helperText,
}: ProfilesSelectProps) => {
const [value, setValue] = useState({ user: "diego" });

const profiles: readonly any[] = ["diego", "jorge", "jose"];

return (
  <React.Fragment>
    <Autocomplete
      multiple={true}
    //  disabled={submitting}
    //  loading={isLoading}
      options={profiles}
      filterSelectedOptions
      isOptionEqualToValue={(option, value) => option.profileId === value.profileId}
      getOptionLabel={(option) => option.name}
    //  onInputChange={(_, value) => setSearchTermDebounced(value)}
    //  value={input.value ? input.value : []}
      onChange={(_, value, reason) => {
        if (reason === "selectOption") {
              //input.onChange(value)
        }
      }}
      renderTags={() => null}
      renderInput={(params) => (
       <TextField
          {...params}
        //  label={label}
        //  error={isError}
        //  disabled={submitting}
          InputProps={{
          ...params.InputProps,
          /*endAdornment: (
            <Fragment>
              {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
              {params.InputProps.endAdornment}
            </Fragment> 
          ), */
          }}
        />
      )}
    />
  <Grid container spacing={1} rowSpacing={{ xs: 2, sm: 1 }} style={{ paddingTop: 20 }}> 
      <React.Fragment>
        <Grid item xs={12} sm={2}>
          <Chip
            onDelete={() => {
             /* input.onChange(
                input.value.filter((member) => member.profileId !== row.profileId)
              )*/
            }}
          /*  label={
              row.name ? row.name : `${row.profile?.firstName} ${row.profile?.lastName}`
            } */
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <DisciplinesSelect
            customOnChange={(value) => {
              //row.role = value
              //input.onChange(input.value)
            }}
            fullWidth={true}
            name={`role-$`}
            label="Role(s)"
         //   defaultValue={row.role}
            size="small"
            style={{ margin: 0 }}
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <SkillsSelect
            customOnChange={(value) => {
         // row.practicedSkills = value
         // input.onChange(input.value)
            }}
            //defaultValue={row.practicedSkills}
            fullWidth={true}
            label="Skills"
            name={`practicedSkills-`}
            size="small"
            style={{ margin: 0 }}
          />
        </Grid>
          <Grid item xs={6} sm={1}>
            <TextField
              label="Hours"
              helperText="H. per week"
              size="small"
              type="number"
              //defaultValue={row.hoursPerWeek}
              onChange={(event) => {
                //row.hoursPerWeek = event.target.value
                //input.onChange(input.value)
              }}
              sx={{
                "& .MuiFormHelperText-root": {
                marginLeft: 0,
                marginRight: 0,
                textAlign: "center",
                },
              }}
            />
          </Grid>
          <Grid item xs={6} sm={1} style={{ textAlign: "center" }}>
            <FormControlLabel
              label="Active"
              control={
                <Checkbox
                  size="small"
                  //defaultChecked={row.active === false ? false : true}
                  onChange={(event) => {
                  //row.active = event.target.checked
                  // input.onChange(input.value)
                  }}
                />
              }
            />
          </Grid>
          <hr className="rows__separator" />
      </React.Fragment>
    </Grid>
  </React.Fragment>
)
};
export default ProjectMembersField
