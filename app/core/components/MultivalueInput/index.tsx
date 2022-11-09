import React, { useState } from "react";
import { Chip, Grid, TextField } from "@mui/material";
import styled from "@emotion/styled";
import { useField, useControlField } from "remix-validated-form";

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
  const [inputValue, setInputValue] = useState("");
  const { error, getInputProps } = useField(name);
  const [values, setValue] = useControlField<string[]>(name);
  return (
    <>
      <MultivalueFieldSpan>* {footer}</MultivalueFieldSpan>
      <TextField
        id={name}
        name={name}
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        fullWidth
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault();
            e.stopPropagation();
            setValue(values ? [...values, inputValue] : [inputValue]);
            setInputValue("");
          }
        }}
      />
      <Grid
        container
        xs={12}
        item
        spacing={1}
        rowSpacing={{ xs: 2, sm: 1 }}
        style={{ paddingTop: 20 }}
      >
        {values
          ? values.map((val, i) => (
              <>
                <Chip
                  key={i}
                  label={val}
                  onDelete={() => setValue(values.filter((v) => v !== val))}
                />
                <input type="hidden" name={name} key={i} value={val} />
              </>
            ))
          : null}
      </Grid>
    </>
  );
};
