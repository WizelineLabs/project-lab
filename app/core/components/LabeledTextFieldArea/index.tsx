import type { PropsWithoutRef } from "react";
import TextField from "@mui/material/TextField";

interface LabeledTextFieldAreaProps {
  name: string;
  label: string;
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number";
  helperText?: string;
  placeholder?: string;
  fullWidth?: boolean;
  style?: any;
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>;
}

export const LabeledTextFieldArea = ({
  name,
  label,
  type,
  helperText,
  outerProps,
  ...props
}: LabeledTextFieldAreaProps) => {
  return (
    <div {...outerProps}>
      <TextField id={name} rows={6} label={label} type={type} {...props} />
    </div>
  );
};

export default LabeledTextFieldArea;
