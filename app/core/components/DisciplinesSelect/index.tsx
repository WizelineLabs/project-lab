import { Fragment, PropsWithoutRef, useState } from "react"
import { useQuery } from "blitz"
import { CircularProgress, TextField, Autocomplete } from "@mui/material"
import { Field, useFormState } from "react-final-form"
import getDisciplines from "app/disciplines/queries/getDisciplines"
import debounce from "lodash/debounce"

interface DisciplinesSelectProps {
  defaultValue?: any[]
  customOnChange?: (arg: any) => void
  fullWidth?: boolean
  name: string
  label: string
  helperText?: string
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
  size?: "small" | "medium" | undefined
  style?: object
  parentName?: string
}

export const DisciplinesSelect = ({
  customOnChange,
  defaultValue = [],
  fullWidth,
  name,
  label,
  helperText,
  outerProps,
  size,
  style,
  parentName,
}: DisciplinesSelectProps) => {
  const [searchTerm, setSearchTerm] = useState<string>("")

  const [data, { isLoading }] = useQuery(
    getDisciplines,
    {
      where: { name: { contains: searchTerm, mode: "insensitive" } },
      orderBy: { name: "asc" },
    },
    { suspense: false }
  )

  const { disciplines } = data || { disciplines: [] }
  const setSearchTermDebounced = debounce(setSearchTerm, 500)

  const { values } = useFormState()

  if (parentName && !values[parentName]) return null

  return (
    <Field name={name}>
      {({ input, meta: { touched, error, submitError, submitting } }) => {
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div {...outerProps}>
            <Autocomplete
              multiple={true}
              fullWidth={fullWidth ? fullWidth : false}
              style={style ? style : { margin: "1em 0" }}
              disabled={submitting}
              loading={isLoading || !data}
              options={disciplines}
              filterSelectedOptions
              isOptionEqualToValue={(option, value) => option.name === value.name}
              getOptionLabel={(option) => option.name}
              onInputChange={(_, value) => setSearchTermDebounced(value)}
              value={input.value ? input.value : defaultValue}
              onChange={(_, value) => {
                input.onChange(value)
                if (customOnChange) customOnChange(value)
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label={label}
                  error={isError}
                  helperText={isError ? error : helperText}
                  disabled={submitting}
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <Fragment>
                        {isLoading ? <CircularProgress color="inherit" size={20} /> : null}
                        {params.InputProps.endAdornment}
                      </Fragment>
                    ),
                  }}
                  size={size}
                  style={{ width: "100%", ...style }}
                />
              )}
            />
          </div>
        )
      }}
    </Field>
  )
}

export default DisciplinesSelect
