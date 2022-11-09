import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";
import { useField, useControlField } from "remix-validated-form";

interface ProfilesSelectProps {
  name: string;
  label: string;
  owner: object;
  helperText?: string;
}

export const ProjectOwnerField = ({
  name,
  label,
  owner,
  helperText,
}: ProfilesSelectProps) => {
  const profiles: readonly any[] = ["diego", "jorge", "jose"];
  const { error, getInputProps } = useField(name);
  const [value, setValue] = useControlField<string[]>(name);
  return (
    <Autocomplete
      options={profiles}
      value={value || []}
      onChange={(_e, newValue) => setValue(newValue)}
      filterSelectedOptions
      renderInput={(params) => (
        <TextField
          {...params}
          id={name}
          name={name}
          label={label}
          error={!!error}
          helperText={error || helperText}
          {...getInputProps()}
        />
      )}
    />
  );
};

export default ProjectOwnerField;
