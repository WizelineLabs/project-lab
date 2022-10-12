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
  outerProps,
  ...props
}: LabeledTextFieldProps) => {
  return (
    <div {...outerProps}>
      <TextField name={name} label={label} type={type} {...props} />
    </div>
  );
};

export default LabeledTextField;
