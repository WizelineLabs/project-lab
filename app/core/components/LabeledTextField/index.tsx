import type { PropsWithoutRef } from "react";
import TextField from "@mui/material/TextField";

interface LabeledTextFieldProps {
  name: string;
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number";
  helperText?: string;
  placeholder?: string;
  fullWidth?: boolean;
  handleChange: React.Dispatch<React.SetStateAction<any>>;
  style?: any;
  multiline?: boolean;
  rows?: number;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
}

export const LabeledTextField = ({
  name,
  label,
  type,
  handleChange,
  helperText,
  outerProps,
  ...props
}: LabeledTextFieldProps) => {
  return (
    <div {...outerProps}>
      <TextField
        id={name}
        name={name}
        onChange={(e) => handleChange({ name: name, newValue: e.target.value })}
        label={label}
        type={type}
        helperText={helperText}
        {...props}
      />
    </div>
  );
};

export default LabeledTextField;
