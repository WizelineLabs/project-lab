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
  parentName,
}: DisciplinesSelectProps) => {
  return (
    <div {...outerProps}>
      <Autocomplete
        multiple={true}
        fullWidth={fullWidth ? fullWidth : false}
        style={style ? style : { margin: "1em 0" }}
        options={disciplines}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
            name={name}
            label={label}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {/* {isLoading ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null} */}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
            size={size}
            style={{ width: "100%", ...style }}
          />
        )}
      />
    </div>
  );
};

export default DisciplinesSelect;
