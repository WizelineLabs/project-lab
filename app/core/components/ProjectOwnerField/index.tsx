import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

interface ProfilesSelectProps {
  name: string;
  label: string;
  owner: object;
  helperText?: string;
  handleChange: React.Dispatch<React.SetStateAction<any>>;
}

export const ProjectOwnerField = ({
  name,
  label,
  owner,
  helperText,
  handleChange,
}: ProfilesSelectProps) => {
  const profiles: readonly any[] = ["diego", "jorge", "jose"];

  return (
    <Autocomplete
      options={profiles}
      renderInput={(params) => (
        <TextField
          {...params}
          id={name}
          name={name}
          label={label}
          onChange={(e) =>
            handleChange({ name: name, newValue: e.target.value })
          }
        />
      )}
    />
  );
};

export default ProjectOwnerField;
