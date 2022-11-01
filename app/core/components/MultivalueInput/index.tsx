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
  handleChange: React.Dispatch<React.SetStateAction<any>>;
  values: string[];
}

export const MultivalueInput = ({
  name,
  label,
  footer,
  handleChange,
  values,
}: ProfilesSelectProps) => {
  const [inputValue, setInputValue] = useState("");
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
            handleChange({ name: name, newValue: [...values, inputValue] });
            setInputValue("");
            e.preventDefault();
            e.stopPropagation();
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
        {values.map((value, i) => (
          <Chip
            key={i}
            label={value}
            onDelete={() => {
              handleChange((prev: any) => ({
                ...prev,
                [name]: values.filter((v) => v !== value),
              }));
            }}
          />
        ))}
      </Grid>
    </>
  );
};
