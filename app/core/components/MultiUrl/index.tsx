import React, { useState } from "react"
import { Chip, Grid, TextField } from "@mui/material"
import styled from "@emotion/styled"
import { useField, FieldArray } from "remix-validated-form"
import { FormInput } from "../FormInput"

export const MultiUrlSpan = styled.span`
  font-size: 12px;
  color: #727e8c;
`

interface MultiUrlProps {
  name: string
  label: string
  helperText?: string
  footer?: string
}

export const MultiUrl = ({ name, label, footer }: MultiUrlProps) => {
  const [inputValue, setInputValue] = useState("")
  const [urlWithError, setUrlWithError] = useState(false)
  let { error } = useField(name)

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
                e.preventDefault()
                e.stopPropagation()
                if (inputValue && !items?.find((v) => v.url === inputValue)) {
                  setInputValue("")
                  push(inputValue)
                }
              }
            }}
          />
          <Grid container rowSpacing={{ xs: 2, sm: 1 }} style={{ paddingTop: 20 }}>
            {items?.map((val, i) => (
              <span key={i}>
                <Chip
                  label={val}
                  onDelete={() => {
                    remove(val)
                    setUrlWithError(false)
                  }}
                />
                <FormInput
                  name={`${name}[${i}].url`}
                  label={`${name}[${i}].url`}
                  value={val}
                  setUrlWithError={setUrlWithError}
                />
              </span>
            ))}
          </Grid>
        </>
      )}
    </FieldArray>
  )
}
