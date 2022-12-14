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

type SkillValue = {
  id: string;
  name: string;
};

interface SkillsSelectProps {
  name: string;
  label: string;
  helperText?: string;
}

const skillsOptions: SubmitOptions = {
  method: "get",
  action: "/api/skills-search",
};

export const SkillsSelect = ({
  name,
  label,
  helperText,
}: SkillsSelectProps) => {
  const skillFetcher = useFetcher<SkillValue[]>();
  const { error } = useField(name);
  const [values, setValues] = useControlField<SkillValue[]>(name);
  const searchSkills = (value: string) => {
    skillFetcher.submit({ q: value }, skillsOptions);
  };
  const searchSkillsDebounced = debounce(searchSkills, 500);

  useEffect(() => {
    if (skillFetcher.type === "init") {
      skillFetcher.submit({}, skillsOptions);
    }
  }, [skillFetcher]);
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
        options={skillFetcher.data ?? []}
        value={values}
        isOptionEqualToValue={(option, value) => option.name === value.name}
        getOptionLabel={(option) => option.name}
        onInputChange={(_, value) => searchSkillsDebounced(value)}
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
                  {skillFetcher.state === "submitting" ? (
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

export default SkillsSelect;
