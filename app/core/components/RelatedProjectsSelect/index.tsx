import type { PropsWithoutRef } from "react";
import { Fragment, useState } from "react";

import { CircularProgress, TextField, Autocomplete } from "@mui/material";

interface RelatedProjectsSelectProps {
  defaultValue?: any[];
  customOnChange?: (arg: any) => void;
  fullWidth?: boolean;
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  size?: "small" | "medium" | undefined;
  style?: object;
  thisProject?: any;
  handleChange: React.Dispatch<React.SetStateAction<any>>;
  values: string[];
}

export const RelatedProjectsSelect = ({
  customOnChange,
  defaultValue = [],
  fullWidth,
  name,
  label,
  helperText,
  outerProps,
  size,
  style,
  handleChange,
  values,
  thisProject,
}: RelatedProjectsSelectProps) => {
  const projects = ["Project 1", "Project 2", "Project 3", "Project 4"];
  return (
    <>
      <div {...outerProps}>
        <Autocomplete
          multiple
          fullWidth={fullWidth ? fullWidth : false}
          style={style ? style : { margin: "1em 0" }}
          options={projects}
          value={values}
          onChange={(_e, newValue) =>
            handleChange({ name: name, newValue: newValue })
          }
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              name={name}
              label={label}
              size={size}
              style={{ width: "100%", ...style }}
            />
          )}
        />
      </div>
    </>
  );
};

export default RelatedProjectsSelect;
