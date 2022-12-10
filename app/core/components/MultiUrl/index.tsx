import React, { useState } from "react";
import { Chip, Stack, TextField } from "@mui/material";
import { useField, useControlField } from "remix-validated-form";

interface MultiUrlProps {
  name: string;
  label: string;
  helperText?: string;
}

interface ValuesProps {
  url: string;
}

export const MultiUrl = ({ name, label, helperText }: MultiUrlProps) => {
  const [inputValue, setInputValue] = useState("");
  const { error } = useField(name);
  const [values, setValue] = useControlField<ValuesProps[]>(name);

  return (
    <>
      <TextField
        id={name}
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        error={!!error}
        helperText={error || helperText}
        fullWidth
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            if (inputValue && !values?.find((v) => v.url === inputValue)) {
              setValue(
                values
                  ? [...values, { url: inputValue }]
                  : [{ url: inputValue }]
              );
              setInputValue("");
            }
          }
        }}
      />
      <Stack direction="row" spacing={1}>
        {values?.map((val, i) => (
          <span key={i}>
            <Chip
              label={val.url}
              onDelete={() => setValue(values.filter((v) => v !== val))}
            />
            <input type="hidden" name={`${name}[${i}].url`} value={val.url} />
          </span>
        ))}
      </Stack>
    </>
  );
};
