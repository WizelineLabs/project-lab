import React, { useEffect } from "react";
import {
  Autocomplete,
  Checkbox,
  Chip,
  FormControlLabel,
  Grid,
  TextField,
  debounce,
} from "@mui/material";
import { SkillsSelect } from "app/core/components/SkillsSelect";
import { DisciplinesSelect } from "~/core/components/DisciplinesSelect";
import { useField, useControlField } from "remix-validated-form";
import LabeledTextField from "../LabeledTextField";
import { useLoaderData, useFetcher } from "@remix-run/react";
import type { SubmitOptions } from "@remix-run/react";

interface ProfilesSelectProps {
  name: string;
  label: string;
  helperText?: string;
}
interface ProjectMembers {
  profileId?: string;
  name?: string;
  role?: string[];
  skills?: string[];
  hours?: number;
  active?: boolean;
}

type profilesValue = {
  profileId: string;
  name: string;
};

const profilesOptions: SubmitOptions = {
  method: "get",
  action: "/api/profiles-search",
};

export const ProjectMembersField = ({
  name,
  label,
  helperText,
}: ProfilesSelectProps) => {
  const { profile } = useLoaderData();

  const { error } = useField(name);

  const [items, setItems] = useControlField<ProjectMembers[]>(name);
  const profilesFetcher = useFetcher<profilesValue[]>();
  const searchprofiles = (value: string) => {
    profilesFetcher.submit({ q: value }, profilesOptions);
  };
  const searchprofilesDebounced = debounce(searchprofiles, 500);

  useEffect(() => {
    if (profilesFetcher.type === "init") {
      profilesFetcher.submit({}, profilesOptions);
    }
  }, [profilesFetcher]);

  return (
    <React.Fragment>
      <Autocomplete
        multiple
        options={profilesFetcher.data ?? []}
        getOptionLabel={(option) => option.name}
        onInputChange={(_, value) => searchprofilesDebounced(value)}
        isOptionEqualToValue={(option, value) =>
          option.profileId === value.profileId
        }
        disableClearable
        onChange={(_event, _newValue, reason, details) => {
          if (reason === "selectOption") {
            setItems(
              items.concat({
                profileId: details?.option.profileId,
                name: details?.option.name,
                active: true,
              })
            );
          }
          if (
            reason === "removeOption" &&
            profile.name !== details?.option.name
          ) {
            setItems(
              items.filter((item) => item.name !== details?.option.name)
            );
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
                  name={`${name}[${i}].profileId`}
                  value={item.profileId}
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
              <DisciplinesSelect //still uses constant values instead of values taken from the db
                name={`${name}[${i}].role`}
                label="Looking for..."
              />
            </Grid>
            <Grid item xs={12} sm={4}>
              <SkillsSelect //still uses constant values instead of values taken from the db
                name={`${name}[${i}].practicedSkills`}
                label="Skills"
              />
            </Grid>
            <Grid item xs={6} sm={1}>
              <LabeledTextField
                label="Hours"
                helperText="H. per week"
                name={`${name}[${i}].hoursPerWeek`}
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
                      );
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
  );
};
export default ProjectMembersField;
