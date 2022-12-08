import React, { useState } from "react"
import { Chip, Grid, TextField } from "@mui/material"
import styled from "@emotion/styled"
import { useField, useControlField } from "remix-validated-form"

export const MultiUrlSpan = styled.span`
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
  url: string
}

export const MultiUrl = ({ name, label, footer }: MultiUrlProps) => {
  const [values, setValue] = useControlField<ValuesProps[]>(name)
  const [inputValue, setInputValue] = useState("")
  let { error } = useField(`${name}[0].url`)
  console.log(error)
  console.log("inputValue", inputValue)
  console.log(values)

  return (
    <>
      <MultiUrlSpan>* {footer}</MultiUrlSpan>
      <TextField
        id={name}
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
            if (inputValue && !values?.find((v) => v.url === inputValue)) {
              setValue(values ? [...values, { url: inputValue }] : [{ url: inputValue }])
              setInputValue("")
            }
          }
        }}
      />
      <Grid container rowSpacing={{ xs: 2, sm: 1 }} style={{ paddingTop: 20 }}>
        {values?.map((val, i) => (
          <span key={i}>
            <Chip label={val.url} onDelete={() => setValue(values.filter((v) => v !== val))} />
            <input type="hidden" name={`${name}[${i}].url`} value={val.url} />
          </span>
        ))}
      </Grid>
    </>
  )
}
