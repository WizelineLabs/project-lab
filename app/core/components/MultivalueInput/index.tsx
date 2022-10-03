import React, { useState } from "react";
import { Chip, Grid, TextField } from "@mui/material";
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
}

export const MultivalueInput = ({
  name,
  label,
  footer,
}: ProfilesSelectProps) => {
  const [inputValue, setInputValue] = useState<string>("");
  return (
    <>
      <MultivalueFieldSpan>* {footer}</MultivalueFieldSpan>
      <TextField
        id={name}
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        fullWidth
      />
      <Grid
        container
        xs={12}
        spacing={1}
        rowSpacing={{ xs: 2, sm: 1 }}
        style={{ paddingTop: 20 }}
      ></Grid>
    </>
  );
};
