import { FormControl, FormLabel, Input, TextField } from "@mui/material"
import { useField } from "remix-validated-form"
import { PersonalizaedFormInput } from "./FormInput.styles"

type FormInputProps = {
  name: string
  label: string
  isRequired?: boolean
  value?: string
  setUrlWithError
}

export const FormInput = ({
  name,
  label,
  isRequired,
  value,
  setUrlWithError,
  ...rest
}: FormInputProps) => {
  const { getInputProps, error } = useField(name)

  if (error === "Invalid url") {
    setUrlWithError(true)
  } else {
    setUrlWithError(false)
  }

  return (
    <PersonalizaedFormInput>
      <FormControl fullWidth>
        <TextField
          error={!!error}
          helperText={error}
          name={name}
          id={name}
          label={label}
          value={value}
        />
      </FormControl>
    </PersonalizaedFormInput>
  )
}
