import type { PropsWithoutRef } from "react";
import { Fragment, useEffect } from "react";

import {
  CircularProgress,
  TextField,
  Autocomplete,
  debounce,
} from "@mui/material";
import { useControlField, useField } from "remix-validated-form";
import type { SubmitOptions } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";

type disciplineValue = {
  id: string;
  name: string;
};

interface disciplinesSelectProps {
  name: string;
  label: string;
  helperText?: string;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
}

const disciplinesOptions: SubmitOptions = {
  method: "get",
  action: "/api/disciplines-search",
};

export const DisciplinesSelect = ({
  name,
  label,
  helperText,
  outerProps,
}: disciplinesSelectProps) => {
  const disciplineFetcher = useFetcher<disciplineValue[]>();
  const { error, getInputProps } = useField(name);
  const [values, setValues] = useControlField<disciplineValue[]>(name);
  const searchdisciplines = (value: string) => {
    disciplineFetcher.submit({ q: value }, disciplinesOptions);
  };
  const searchdisciplinesDebounced = debounce(searchdisciplines, 500);

  useEffect(() => {
    if (disciplineFetcher.type === "init") {
      disciplineFetcher.submit({}, disciplinesOptions);
    }
  }, [disciplineFetcher]);
  return (
    <div {...outerProps}>
      {values?.map((value, i) => (
        <input
          type="hidden"
          name={`${name}[${i}].id`}
          key={i}
          value={value.id}
        />
      ))}
      <Autocomplete
        multiple={true}
        fullWidth
        {...getInputProps()}
        style={{ margin: "1em 0" }}
        options={disciplineFetcher.data ?? []}
        value={values}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        onInputChange={(_, value) => searchdisciplinesDebounced(value)}
        onChange={(_e, newValues) => {
          setValues(newValues);
        }}
        filterSelectedOptions
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            error={!!error}
            helperText={error || helperText}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <Fragment>
                  {disciplineFetcher.state === "submitting" ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    </div>
  );
};

export default DisciplinesSelect;
