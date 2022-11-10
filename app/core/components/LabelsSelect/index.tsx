import type { PropsWithoutRef } from "react";
import { Fragment, useState } from "react";

import { CircularProgress, TextField, Autocomplete } from "@mui/material";
import { useField, useControlField } from "remix-validated-form";

interface LabelsSelectProps {
  defaultValue?: any[];
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
}

export const LabelsSelect = ({
  name,
  label,
  helperText,
  defaultValue = [],
  outerProps,
}: LabelsSelectProps) => {
  const labels = ["React", "Node", "Python", "Java", "C++", "C#"];
  const { error, getInputProps } = useField(name);
  const [values, setValue] = useControlField<string[]>(name);
  return (
    <div {...outerProps}>
      {values?.map((val) => (
        <input type="hidden" name={name} key={val} value={val} />
      ))}
      <Autocomplete
        multiple={true}
        fullWidth
        style={{ margin: "1em 0" }}
        options={labels}
        value={values || defaultValue}
        onChange={(_e, newValue) => setValue(newValue)}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            label={label}
            error={!!error}
            helperText={error || helperText}
            {...getInputProps()}
          />
        )}
      />
    </div>
  );
};

export default LabelsSelect;
