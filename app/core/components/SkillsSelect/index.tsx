import type { PropsWithoutRef } from "react";
import { Fragment, useState } from "react";

import { CircularProgress, TextField, Autocomplete } from "@mui/material";

interface SkillsSelectProps {
  defaultValue?: any[];
  customOnChange?: (arg: any) => void;
  fullWidth?: boolean;
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  handleChange: React.Dispatch<React.SetStateAction<any>>;
  values: string[];
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
  handleChange,
  values,
  helperText,
  outerProps,
  size,
  style,
}: SkillsSelectProps) => {
  return (
    <div {...outerProps}>
      <Autocomplete
        multiple
        fullWidth={fullWidth ? fullWidth : false}
        style={style ? style : { margin: "1em 0" }}
        value={values}
        onChange={(_e, newValue) =>
          handleChange({ name: name, newValue: newValue })
        }
        options={skills}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            label={label}
            size={size}
            style={{ width: "100%", ...style }}
          />
        )}
      />
    </div>
  );
};

export default SkillsSelect;
