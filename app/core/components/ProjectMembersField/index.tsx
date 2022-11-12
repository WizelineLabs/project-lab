import React, { useEffect, useState } from "react";
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
} from "@mui/material";
import { SkillsSelect } from "app/core/components/SkillsSelect";
import { DisciplinesSelect } from "app/core/components/DisciplineSelect";
import { useField, useControlField } from "remix-validated-form";
import LabeledTextField from "../LabeledTextField";
import { useLoaderData } from "@remix-run/react";

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
  const { profile } = useLoaderData();

  const { error, getInputProps } = useField(name);

  const [items, setItems] = useControlField<string[]>(name);

  useEffect(() => {
    if (profile) {
      setItems([profile.id]);
    }
  }, [profile]);

  console.log(items);
  const profiles: readonly any[] = ["diego", "jorge", "jose"];
  return (
    <React.Fragment>
      <Autocomplete
        multiple
        options={profiles}
        disableClearable
        value={items || []}
        onChange={(_event, newValue) => {
          setItems(newValue);
        }}
        renderTags={() => null}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!!error}
            {...getInputProps()}
          />
        )}
      />
      {items?.map((item, i) => (
        <Grid
          key={i}
          container
          spacing={1}
          alignItems="baseline"
          rowSpacing={{ xs: 2, sm: 1 }}
          style={{ paddingTop: 20 }}
        >
          <React.Fragment>
            <Grid item xs={12} sm={2}>
              <>
                <input type="hidden" name={`${name}[${i}].name`} value={item} />
                <Chip
                  label={item}
                  onDelete={() => {
                    if (item !== profile.name) {
                      setItems(items.filter((_, index) => index !== i));
                    }
                  }}
                />
              </>
            </Grid>
            <Grid item xs={12} sm={4}>
              <DisciplinesSelect //this still uses constant values instead of values taken from the db
                name={`${name}[${i}].roles`}
                label="Looking for..."
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SkillsSelect name={`${name}[${i}].skills`} label="Skills" />
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
                label="Active"
                control={<Checkbox size="small" />}
              />
            </Grid>
            <hr className="rows__separator" />
          </React.Fragment>
        </Grid>
      ))}
    </React.Fragment>
  );
};
export default ProjectMembersField;
