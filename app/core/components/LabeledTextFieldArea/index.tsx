import { TextField } from "@mui/material";
import type { PropsWithoutRef } from "react";
import { useField } from "remix-validated-form";

interface LabeledTextFieldAreaProps {
  name: string;
  label: string;
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
  const { error, getInputProps } = useField(name);

  return (
    <div {...outerProps}>
      <TextField
        id={name}
        name={name}
        rows={6}
        helperText={error || helperText}
        error={!!error}
        label={label}
        type={type}
        {...getInputProps()}
        {...props}
      />
    </div>
  );
};

export default LabeledTextFieldArea;
