import React, { useState } from "react";
import { Autocomplete, Chip, Grid, TextField } from "@mui/material";
import styled from "@emotion/styled";

export const MultivalueFieldSpan = styled.span`
  font-size: 12px;
  color: #727e8c;
`;

interface ProfilesSelectProps {
  name: string;
  label: string;
  footer: string;
  helperText?: string;
  style?: object;
  fullWidth?: boolean;
  size?: "small" | "medium";
}

export const MultivalueInput = ({
  name,
  label,
  footer,
  fullWidth,
  style,
  size,
}: ProfilesSelectProps) => {
  const [value, setValue] = useState<string[]>([]);

  return (
    <>
      <MultivalueFieldSpan>* {footer}</MultivalueFieldSpan>
      <Autocomplete
        multiple
        freeSolo
        fullWidth={fullWidth ? fullWidth : false}
        style={style ? style : { margin: "1em 0" }}
        options={[]}
        filterSelectedOptions
        onChange={(_event, newValue) => {
          setValue(newValue);
        }}
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
      <input hidden name={name} value={value} />
    </>
  );
};
