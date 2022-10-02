import React, { useState } from "react";
import { Autocomplete, TextField } from "@mui/material";

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
  const [value, setValue] = useState({ user: "diego" });

  const profiles: readonly any[] = ["diego", "jorge", "jose"];

  return (
    <Autocomplete
      id={name}
      //   loading={isLoading || !data}
      value={value}
      onChange={(_, newValue: any | null, reason) => {
        if (reason === "selectOption") {
          setValue(newValue);
        }
      }}
      getOptionLabel={(option) => option.name}
      options={profiles}
      renderInput={(params) => (
        <TextField
          {...params}
          id={name}
          label={label}
          //   error={isError}
          //   disabled={submitting}
        />
      )}
    />
  );
};

export default ProjectOwnerField;
