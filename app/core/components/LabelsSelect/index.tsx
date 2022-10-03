import type { PropsWithoutRef } from "react";
import { Fragment, useState } from "react";

import { CircularProgress, TextField, Autocomplete } from "@mui/material";

interface LabelsSelectProps {
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
}

export const LabelsSelect = ({
  name,
  label,
  helperText,
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
        filterSelectedOptions
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
          />
        )}
      />
    </div>
  );
};

export default LabelsSelect;
