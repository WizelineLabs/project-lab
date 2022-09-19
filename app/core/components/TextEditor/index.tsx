import type { PropsWithoutRef } from "react";
import TextField from "@mui/material/TextField";

interface TextEditorProps {
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

export const TextEditor = ({
  name,
  label,
  type,
  helperText,
  outerProps,
  ...props
}: TextEditorProps) => {
    return (
        <div {...outerProps}>
            <TextField
                id={name}
                rows={6}
                name={name}
                label={label}
                //   error={isError ? isError.length > 0 : false}
                //   helperText={isError ? error : helperText}
                type={type}
                //   disabled={submitting}
                {...props}
            />
        </div>
    );
}


export default TextEditor;
