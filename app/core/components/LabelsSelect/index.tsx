import {
  CircularProgress,
  TextField,
  Autocomplete,
  debounce,
} from "@mui/material";
import type { SubmitOptions } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { Fragment, useEffect } from "react";
import { useControlField, useField } from "remix-validated-form";

interface LabelValue {
  id: string;
  name: string;
}

interface LabelsSelectProps {
  name: string;
  label: string;
  helperText?: string;
}

const labelsOptions: SubmitOptions = {
  method: "get",
  action: "/api/labels-search",
};

export const LabelsSelect = ({
  name,
  label,
  helperText,
}: LabelsSelectProps) => {
  const labelFetcher = useFetcher<LabelValue[]>();
  const { error } = useField(name);
  const [values, setValues] = useControlField<LabelValue[]>(name);
  const searchLabels = (value: string) => {
    labelFetcher.submit({ q: value }, labelsOptions);
  };
  const searchLabelsDebounced = debounce(searchLabels, 500);

  useEffect(() => {
    if (labelFetcher.state === "idle" && labelFetcher.data == null) {
      labelFetcher.submit({}, labelsOptions);
    }
  }, [labelFetcher]);
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
        options={labelFetcher.data ?? []}
        value={values}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        onInputChange={(_, value) => searchLabelsDebounced(value)}
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
                  {labelFetcher.state === "submitting" ? (
                    <CircularProgress color="inherit" size={20} />
                  ) : null}
                  {params.InputProps.endAdornment}
                </Fragment>
              ),
            }}
          />
        )}
      />
    </>
  );
};

export default LabelsSelect;
