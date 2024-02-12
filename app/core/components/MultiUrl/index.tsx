import { FormInput } from "../FormInput";
import styled from "@emotion/styled";
import { Chip, Grid, TextField } from "@mui/material";
import { useState } from "react";
import { useField, useFieldArray, useFormContext } from "remix-validated-form";

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
  const { error } = useField(name);

  const { fieldErrors } = useFormContext();
  let urlWithError = false;
  if (Object.keys(fieldErrors).find((v) => v.startsWith(name))) {
    urlWithError = true;
  }

  const [items, { push, remove }] = useFieldArray<{ id?: number; url: string }>(
    name
  );

  return (
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
            if (
              inputValue &&
              !items.find((v) => v.defaultValue.url === inputValue)
            ) {
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
        {items.map((val, i) => (
          <span key={i}>
            <Chip
              label={val.defaultValue.url}
              onDelete={() => {
                remove(i);
              }}
            />

            <FormInput
              name={`${name}[${i}].url`}
              label={`${name}[${i}].url`}
              value={val.defaultValue.url}
            />
          </span>
        ))}
      </Grid>
    </>
  );
};
