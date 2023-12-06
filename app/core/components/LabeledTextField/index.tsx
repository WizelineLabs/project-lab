import type { PropsWithoutRef } from "react";
import TextField from "@mui/material/TextField";
import { useControlField, useField } from "remix-validated-form";

interface LabeledTextFieldProps {
  name: string;
  label: string;
  type?: "text" | "password" | "email" | "number" | "date";
  helperText?: string;
  placeholder?: string;
  fullWidth?: boolean;
  size?: "small" | "medium" | undefined;
  sx?: object;
  style?: any;
  multiline?: boolean;
  rows?: number;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
  inputProps?: React.InputHTMLAttributes<HTMLInputElement>;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
}

export const LabeledTextField = ({
  name,
  label,
  type,
  helperText,
  size,
  outerProps,
  inputProps,
  onChange,
  disabled,
  ...props
}: LabeledTextFieldProps) => {
  const { error } = useField(name);

  const [value, setValue] = useControlField<string>(name);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    if (onChange) {
      onChange(e);
    }
  };

  return (
    <div {...outerProps}>
      <TextField
        id={name}
        name={name}
        label={label}
        value={value || ""}
        onChange={handleChange}
        type={type}
        size={size}
        helperText={error || helperText}
        error={!!error}
        disabled={disabled}
        {...props}
        InputLabelProps={
          type === "date" ? { shrink: true } : undefined
        }
        inputProps={inputProps}
      />
    </div>
  );
};

export default LabeledTextField;
