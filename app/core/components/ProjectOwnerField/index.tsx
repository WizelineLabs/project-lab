import {
  CircularProgress,
  TextField,
  Autocomplete,
  debounce,
} from "@mui/material";
import type { SubmitOptions } from "@remix-run/react";
import { useFetcher } from "@remix-run/react";
import { useEffect } from "react";
import { useControlField, useField } from "remix-validated-form";

interface ProfileValue {
  id: string;
  name: string;
}

interface ProfilesSelectProps {
  name: string;
  label: string;
  helperText?: string;
}

const fetcherOptions: SubmitOptions = {
  method: "get",
  action: "/api/profiles-search",
};

export const ProjectOwnerField = ({
  name,
  label,
  helperText,
}: ProfilesSelectProps) => {
  const fetcher = useFetcher<ProfileValue[]>();
  const { error } = useField(name);
  const [value, setValue] = useControlField<string>(name);
  const searchValues = (searchTerm: string) => {
    if (!searchTerm.includes("<")) {
      fetcher.submit({ q: searchTerm, profileId: value }, fetcherOptions);
    }
  };
  const searchValuesDebounced = debounce(searchValues, 500);

  useEffect(() => {
    if (fetcher.state === "idle" && fetcher.data == null) {
      fetcher.submit({ profileId: value }, fetcherOptions);
    }
  }, [fetcher, value]);

  const autocompleteValue = fetcher.data?.find((v) => v.id === value) || {
    id: value,
    name: value,
  };

  return (
    <>
      <input type="hidden" name={name} value={value} />
      <Autocomplete
        options={fetcher.data ?? []}
        value={autocompleteValue}
        loading={fetcher.state !== "idle"}
        filterOptions={(x) => x}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        getOptionLabel={(option) => option.name}
        onInputChange={(_, value) => searchValuesDebounced(value)}
        onChange={(_e, newValue) => {
          setValue(newValue?.id ?? "");
        }}
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
                  {fetcher.state !== "idle" ? (
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

export default ProjectOwnerField;
