import type { PropsWithoutRef } from "react";
import { Fragment, useState } from "react";

import { CircularProgress, TextField, Autocomplete } from "@mui/material";

interface LabelsSelectProps {
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  handleChange: React.Dispatch<React.SetStateAction<any>>;
  values: string[];
}

export const LabelsSelect = ({
  name,
  label,
  helperText,
  handleChange,
  values,
  outerProps,
}: LabelsSelectProps) => {
  const labels = ["React", "Node", "Python", "Java", "C++", "C#"];
  return (
    <div {...outerProps}>
      <Autocomplete
        multiple={true}
        fullWidth
        style={{ margin: "1em 0" }}
        options={labels}
        value={values}
        onChange={(_e, newValue) =>
          handleChange({ name: name, newValue: newValue })
        }
        filterSelectedOptions
        renderInput={(params) => (
          <TextField {...params} id={name} label={label} />
        )}
      />
    </div>
  );
};

export default LabelsSelect;
