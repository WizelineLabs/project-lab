import React, { useState } from "react"
import { Chip, Grid, TextField } from "@mui/material"
import styled from "@emotion/styled"
import { useField, useControlField } from "remix-validated-form"

export const MultivalueFieldSpan = styled.span`
  font-size: 12px;
  color: #727e8c;
`

interface MultiUrlProps {
  name: string
  label: string
  footer: string
  helperText?: string
}

interface ValuesProps {
  id?: number
  url: string
}

export const MultiUrl = ({ name, label, footer }: MultiUrlProps) => {
  const [inputValue, setInputValue] = useState("")
  const { error } = useField(name)
  const [values, setValue] = useControlField<ValuesProps[]>(name)
  return (
    <>
      <MultivalueFieldSpan>* {footer}</MultivalueFieldSpan>
      <TextField
        id={name}
        name={name}
        label={label}
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        error={!!error}
        helperText={error}
        fullWidth
        onKeyDown={(e) => {
          if (e.key === "Enter") {
            e.preventDefault()
            e.stopPropagation()
            if (inputValue) {
              setValue(values ? [...values, { url: inputValue }] : [{ url: inputValue }])
              setInputValue("")
            }
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
        {values?.map((val, i) => (
          <span key={i}>
            <Chip label={val.url} onDelete={() => setValue(values.filter((v) => v !== val))} />
            <input type="hidden" name={name} value={val.url} />
          </span>
        ))}
      </Grid>
    </>
  )
}
