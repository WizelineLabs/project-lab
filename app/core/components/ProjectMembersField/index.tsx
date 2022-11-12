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

  const { error } = useField(name);

  const [items, setItems] = useControlField<object[]>(name);

  const profiles: readonly any[] = [
    "jorge",
    "jose",
    "Diego Mojarro Tapia",
    "Andres Contreras",
  ];

  return (
    <React.Fragment>
      <Autocomplete
        multiple
        options={profiles}
        disableClearable
        value={items.map((item) => item.name)}
        onChange={(_event, _newValue, reason, details) => {
          if (reason === "selectOption") {
            setItems(
              items.concat({
                name: details?.option,
              })
            );
          }
          if (reason === "removeOption" && profile.name !== details?.option) {
            setItems(items.filter((item) => item.name !== details?.option));
          }
        }}
        renderTags={() => null}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!!error}
            helperText={error || helperText}
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
        {items?.map((item, i) => (
          <React.Fragment key={i}>
            <Grid item xs={12} sm={2}>
              <>
                <input
                  type="hidden"
                  name={`${name}[${i}].name`}
                  value={item.name}
                />
                <Chip
                  label={item.name}
                  onDelete={() => {
                    if (item.name !== profile.name) {
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
        ))}
      </Grid>
    </React.Fragment>
  );
};
export default ProjectMembersField;
