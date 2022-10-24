import type { PropsWithoutRef } from "react";
import { Fragment, useState } from "react";
import { CircularProgress, TextField, Autocomplete } from "@mui/material";
/*
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
  const projects = ["Project 1", "Project 2", "Project 3", "Project 4"];
  return (
    <>
      <div {...outerProps}>
        <Autocomplete
          multiple={true}
          fullWidth={fullWidth ? fullWidth : false}
          style={style ? style : { margin: "1em 0" }}
          options={projects}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              name={name}
              label={label}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <Fragment>
//                    { {isLoading ? (
//                      <CircularProgress color="inherit" size={20} />
//                    ) : null} }
//                    {params.InputProps.endAdornment}
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

export default RelatedProjectsSelect; */
