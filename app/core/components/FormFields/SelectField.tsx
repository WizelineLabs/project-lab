import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import type { SelectChangeEvent } from "@mui/material/Select";
import Select from "@mui/material/Select";
import React, { useEffect } from "react";
import { useField, useControlField } from "remix-validated-form";

interface SelectFieldProps {
  name: string;
  label: string;
  options: string[];
  value?: string;
  onChange?: (
    event?: SelectChangeEvent<string>,
    child?: React.ReactNode
  ) => void;
  style?: React.CSSProperties;
}

const errorStyle = {
  color: "red",
};

const SelectField: React.FC<SelectFieldProps> = ({
  name,
  label,
  options,
  style,
  onChange,
  value,
}) => {
  const { error } = useField(name);
  const [selectedValue, setSelectedValue] = useControlField<string>(name);

  const handleChange = (event: SelectChangeEvent<string>) => {
    setSelectedValue(event.target.value);
  };

  useEffect(() => {
    if (value !== undefined) {
      setSelectedValue(value);
    }
  },[value, setSelectedValue])

  return (
    <div>
      <FormControl style={style} error={!!error}>
        <InputLabel>{label}</InputLabel>
        <Select
          label={label}
          name={name}
          id={name}
          value={selectedValue || ""}
          onChange={(e) => {
            handleChange(e);
            if (onChange != undefined) {
              onChange(e);
            }
          }}
        >
          {options.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
        {error ? <small style={{ ...errorStyle }}>{error}</small> : null}
      </FormControl>
    </div>
  );
};

export default SelectField;
