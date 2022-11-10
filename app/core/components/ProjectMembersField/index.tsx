import React, { Fragment, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  Chip,
  CircularProgress,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { SkillsSelect } from "app/core/components/SkillsSelect";
import { DisciplinesSelect } from "app/core/components/DisciplineSelect";
import { useField, useControlField } from "remix-validated-form";

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
  const { error, getInputProps } = useField(name);
  const [contributosValues, setContributorsValues] =
    useControlField<string[]>(name);
  const profiles: readonly any[] = ["diego", "jorge", "jose"];
  return (
    <React.Fragment>
      <Autocomplete
        multiple
        options={profiles}
        value={contributosValues || []}
        onChange={(_e, newValue) => setContributorsValues(newValue)}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!!error}
            {...getInputProps()}
          />
        )}
      />
      <Grid
        container
        spacing={1}
        alignItems="baseline"
        rowSpacing={{ xs: 2, sm: 1 }}
        style={{ paddingTop: 20 }}
      >
        <React.Fragment>
          <Grid item xs={12} sm={2}>
            <Chip label={values.owner} />
          </Grid>
          <Grid item xs={12} sm={4}>
            <DisciplinesSelect //this still uses constant values instead of values taken from the db
              name="disciplines2"
              label="Looking for..."
            />
          </Grid>
          <Grid item xs={12} sm={4}>
            <SkillsSelect name="skills2" label="Skills" />
          </Grid>
          <Grid item xs={6} sm={1}>
            <TextField
              label="Hours"
              helperText="H. per week"
              name="hours"
              size="small"
              type="number"
              onChange={(event) =>
                handleChange({ name: "hours", newValue: event.target.value })
              }
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
              label="Active"
              control={
                <Checkbox
                  size="small"
                  checked={values.active}
                  onChange={(event) =>
                    handleChange({
                      name: "active",
                      newValue: event.target.checked,
                    })
                  }
                />
              }
            />
          </Grid>
          <hr className="rows__separator" />
        </React.Fragment>
      </Grid>
    </React.Fragment>
  );
};
export default ProjectMembersField;
