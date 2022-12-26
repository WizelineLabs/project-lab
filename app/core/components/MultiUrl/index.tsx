import React, { useState } from "react";
import { Chip, Grid, TextField } from "@mui/material";
import styled from "@emotion/styled";
import { useField, FieldArray, useFormContext } from "remix-validated-form";
import { FormInput } from "../FormInput";

export const MultiUrlSpan = styled.span`
  font-size: 12px;
  color: #727e8c;
`;

interface MultiUrlProps {
  name: string;
  label: string;
  helperText?: string;
  footer?: string;
}

export const MultiUrl = ({ name, label, footer }: MultiUrlProps) => {
  const [inputValue, setInputValue] = useState("");
  let { error } = useField(name);

  const { fieldErrors } = useFormContext();
  let urlWithError = false;
  if (Object.keys(fieldErrors).find((v) => v.startsWith(name))) {
    urlWithError = true;
  }

  return (
    <FieldArray name={name}>
      {(items, { push, remove }) => (
        <>
          <MultiUrlSpan>{footer}</MultiUrlSpan>
          <TextField
            id={name}
            label={label}
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            error={urlWithError}
            helperText={error}
            fullWidth
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                e.stopPropagation();
                if (inputValue && !items?.find((v) => v === inputValue)) {
                  setInputValue("");
                  push({ url: inputValue });
                }
              }
            }}
          />
          <Grid
            container
            rowSpacing={{ xs: 2, sm: 1 }}
            style={{ paddingBottom: 20 }}
          >
            {items?.map((val, i) => (
              <span key={i}>
                <Chip
                  label={val.url}
                  onDelete={() => {
                    remove(i);
                  }}
                />

                <FormInput
                  name={`${name}[${i}].url`}
                  label={`${name}[${i}].url`}
                  value={val.url}
                />
              </span>
            ))}
          </Grid>
        </>
      )}
    </FieldArray>
  );
};
