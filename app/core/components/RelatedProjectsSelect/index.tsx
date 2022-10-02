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
  const projects = [
    { name: "Project 1" },
    { name: "Project 2" },
    { name: "Project 3" },
    { name: "Project 4" },
  ];
  return (
    <>
      <div {...outerProps}>
        <Autocomplete
          multiple={true}
          fullWidth={fullWidth ? fullWidth : false}
          style={style ? style : { margin: "1em 0" }}
          //   disabled={submitting}
          //   loading={isLoading || !data}
          options={projects}
          filterOptions={(x) => x}
          filterSelectedOptions
          isOptionEqualToValue={(option, value) => option.name === value.name}
          getOptionLabel={(option) => option.name}
          value={defaultValue}
          renderInput={(params) => (
            <TextField
              {...params}
              name={name}
              label={label}
              //   error={isError}
              //   helperText={isError ? error : helperText}
              //   disabled={submitting}
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
    </>
  );
};

export default RelatedProjectsSelect;
