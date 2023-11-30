import { useEffect } from "react";
import {
  CircularProgress,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useField } from "remix-validated-form";
import type { SubmitOptions } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";

type universityValue = {
  id: string;
  name: string;
};

interface universitiesSelectProps {
  name: string;
  label: string;
  selected?: string
}

const universitiesOptions: SubmitOptions = {
  method: "get",
  action: "/api/universities-search",
};

export const UniversitySelect = ({ name, label, selected } : universitiesSelectProps) => {
  const universityFetcher = useFetcher<universityValue[]>();
  const { error } = useField(name);

  useEffect(() => {
    if (universityFetcher.type === "init") {
      universityFetcher.submit({}, universitiesOptions);
    }
  }, [universityFetcher]);
  return (
    <>
      <Autocomplete
        options={universityFetcher.data?.map((a) => {
          return a.name;
        }) ?? []}
        value={selected}
        renderInput={(params) => (
          <TextField
            {...params}
            label={label}
            name="university"
            error={!!error}
            helperText={error}
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {universityFetcher.state === "submitting" ? (
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

export default UniversitySelect;
