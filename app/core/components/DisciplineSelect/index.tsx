import type { PropsWithoutRef } from "react";
import { Fragment, useState } from "react";

import { CircularProgress, TextField, Autocomplete } from "@mui/material";

interface DisciplinesSelectProps {
  defaultValue?: any[];
  customOnChange?: (arg: any) => void;
  fullWidth?: boolean;
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  size?: "small" | "medium" | undefined;
  handleChange: React.Dispatch<React.SetStateAction<any>>;
  values: string[];
  style?: object;
  parentName?: string;
}

const disciplines = [
  "Android Engineer",
  "Automatation QA",
  "Backend",
  "Consultant",
];

export const DisciplinesSelect = ({
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
}: DisciplinesSelectProps) => {
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
        options={disciplines}
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

export default DisciplinesSelect;
