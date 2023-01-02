import type { PropsWithoutRef } from "react";

import { TextField, Autocomplete } from "@mui/material";
import { useField, useControlField } from "remix-validated-form";

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
  thisProject,
}: RelatedProjectsSelectProps) => {
  const { error, getInputProps } = useField(name);
  const [values, setValue] = useControlField<string[]>(name);
  const projects = ["Project 1", "Project 2", "Project 3", "Project 4"];
  return (
    <>
      <div {...outerProps}>
        {values?.map((val) => (
          <input type="hidden" name={name} key={val} value={val} />
        ))}
        <Autocomplete
          multiple
          fullWidth={fullWidth ? fullWidth : false}
          style={style ? style : { margin: "1em 0" }}
          options={projects}
          value={values || []}
          onChange={(_e, newValue) => setValue(newValue)}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              name={name}
              label={label}
              size={size}
              error={!!error}
              helperText={error || helperText}
              {...getInputProps()}
              style={{ width: "100%", ...style }}
            />
          )}
        />
      </div>
    </>
  );
};

export default RelatedProjectsSelect;
