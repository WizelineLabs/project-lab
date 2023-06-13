import { useEffect } from "react";
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
}

const disciplinesOptions: SubmitOptions = {
  method: "get",
  action: "/api/disciplines-search",
};

export const DisciplinesSelect = ({
  name,
  label,
  helperText,
}: disciplinesSelectProps) => {
  const disciplineFetcher = useFetcher<disciplineValue[]>();
  const { error } = useField(name);
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
    <>
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
                <>
                  {disciplineFetcher.state === "submitting" ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default DisciplinesSelect;
