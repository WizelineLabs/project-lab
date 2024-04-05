import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";
import { useControlField, useField } from "remix-validated-form";

interface SelectValue {
  name: string;
}

interface InputSelectProps {
  valuesList: SelectValue[];
  name: string;
  label: string;
  helperText?: string;
  disabled?: boolean;
}

export const InputSelect = ({
  valuesList,
  name,
  label,
  helperText,
  disabled,
}: InputSelectProps) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<string>(name);
  return (
    <FormControl fullWidth id={name} size="small" error={!!error}>
      <input type="hidden" name={name} value={value} />
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        label={label}
        value={value}
        error={!!error}
        onChange={(event) => {
          const newValue = valuesList.find(
            (item) => item.name === event.target.value
          );
          if (newValue) setValue(newValue.name);
        }}
        disabled={disabled}
      >
        {valuesList.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{error || helperText}</FormHelperText>
    </FormControl>
  );
};

export default InputSelect;
