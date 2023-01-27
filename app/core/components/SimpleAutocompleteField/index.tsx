import {
  TextField,
  Autocomplete,
} from "@mui/material";
import { useControlField, useField } from "remix-validated-form";

interface SimpleAutocompleteFieldProps {
  name: string;
  label: string;
  readOnly: boolean;
  options: string[];
  helperText?: string;
  freeSolo?: boolean;
}

const SimpleAutocompleteField = ({
  name,
  label,
  options,
  readOnly,
  helperText,
  freeSolo,
}: SimpleAutocompleteFieldProps) => {
  const { error } = useField(name, { formId: 'projectResourcesForm' });
  const [value, setValue] = useControlField<string>(name, 'projectResourcesForm');

  return (
    <>
      <input type="hidden" name={name} value={value || ""} />
      <Autocomplete
        options={options}
        value={value || ""}
        filterSelectedOptions
        renderInput={(params) => <TextField {...params} label={label} helperText={error || helperText} error={!!error} />}
        disablePortal
        sx={{ width: '100%' }}
        readOnly={readOnly}
        freeSolo={freeSolo}
        autoSelect
        onChange={(_, newValue) => {
          setValue(newValue || "");
        }}
      />
    </>
  );
};

export default SimpleAutocompleteField;
