import type { PropsWithoutRef } from "react";
import TextField from "@mui/material/TextField";
import { useControlField, useField } from "remix-validated-form";

interface LabeledTextFieldProps {
  name: string;
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number";
  helperText?: string;
  placeholder?: string;
  fullWidth?: boolean;
  size?: "small" | "medium" | undefined;
  sx?: object;
  style?: any;
  multiline?: boolean;
  rows?: number;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
}

export const LabeledTextField = ({
  name,
  label,
  type,
  helperText,
  size,
  outerProps,
  ...props
}: LabeledTextFieldProps) => {
  const { error } = useField(name);

  const [value, setValue] = useControlField<string>(name);
  return (
    <div {...outerProps}>
      <TextField
        id={name}
        name={name}
        label={label}
        value={value || ""}
        onChange={(e) => setValue(e.target.value)}
        type={type}
        size={size}
        helperText={error || helperText}
        error={!!error}
        {...props}
      />
    </div>
  );
};

export default LabeledTextField;
