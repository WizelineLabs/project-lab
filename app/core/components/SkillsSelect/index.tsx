import type { PropsWithoutRef } from "react";
import { Fragment, useState } from "react";

import { CircularProgress, TextField, Autocomplete } from "@mui/material";
import { useField, useControlField } from "remix-validated-form";

interface SkillsSelectProps {
  defaultValue?: any[];
  customOnChange?: (arg: any) => void;
  fullWidth?: boolean;
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  size?: "small" | "medium" | undefined;
  style?: object;
}

const skills = ["React", "Node", "Python", "Java", "C++", "C#"];

export const SkillsSelect = ({
  customOnChange,
  defaultValue = [],
  fullWidth,
  name,
  label,
  helperText,
  outerProps,
  size,
  style,
}: SkillsSelectProps) => {
  const { error, getInputProps } = useField(name);
  const [values, setValue] = useControlField<string[]>(name);
  return (
    <div {...outerProps}>
      {values?.map((val) => (
        <input type="hidden" name={name} key={val} value={val} />
      ))}
      <Autocomplete
        multiple
        fullWidth={fullWidth ? fullWidth : false}
        style={style ? style : { margin: "1em 0" }}
        value={values || []}
        onChange={(_e, newValue) => setValue(newValue)}
        options={skills}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            label={label}
            size={size}
            error={!!error}
            helperText={error || helperText}
            style={{ width: "100%", ...style }}
          />
        )}
      />
    </div>
  );
};

export default SkillsSelect;
