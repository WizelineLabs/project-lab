import {
    Select,
    MenuItem,
    FormControl,
    InputLabel,
    FormHelperText,
  } from "@mui/material";
  import { useControlField, useField } from "remix-validated-form";
  
  type SelectValue = {
    name: string;
    id: string;
  };
  
  interface InputSelectProps {
    valuesList: SelectValue[];
    name: string;
    label: string;
    helperText?: string;
    disabled?: boolean;
    onChange?: (e: SelectValue) => void;
  }
  
  export const RegularSelect = ({
    valuesList,
    name,
    label,
    helperText,
    disabled,
    onChange,
  }: InputSelectProps) => {
    const { error } = useField(name);
    
    const [value, setValue] = useControlField<SelectValue>(name);
    return (
      <FormControl fullWidth id={name} size="small" error={!!error}>
        <input type="hidden" name={`${name}.name`} value={value?.name} />
        <input type="hidden" name={`${name}.id`} value={value?.id} />
        <InputLabel id={name}>{label}</InputLabel>
        <Select
          label={label}
          value={value}
          error={!!error}
          onChange={(event) => {
            
            const newValue = valuesList.find(
              (item) => item.name === event.target.value
            );
            if (newValue) setValue(newValue);
            onChange && onChange(newValue as SelectValue);
          }}
          disabled={disabled}
        >
          {valuesList.map((item) => (
            <MenuItem key={item.id} value={item.name}>
              {item.name}
            </MenuItem>
          ))}
        </Select>
        <FormHelperText>{error || helperText}</FormHelperText>
      </FormControl>
    );
  };
  
  export default RegularSelect;
  