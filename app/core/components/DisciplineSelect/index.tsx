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
  size?: "small" | "medium";
  style?: object;
  parentName?: string;
}

const disciplines = [
  // this is harcoded for now, in another PR will be done Fetching from the db
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
  const [value, setValue] = useState(defaultValue);
  return (
    <div {...outerProps}>
      <Autocomplete
        multiple={true}
        fullWidth={fullWidth ? fullWidth : false}
        style={style ? style : { margin: "1em 0" }}
        options={disciplines}
        filterSelectedOptions
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            id={name}
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
      <input type="hidden" name={name} value={value} />
    </div>
  );
};

export default DisciplinesSelect;
