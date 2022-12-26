import { TextareaAutosize } from "@mui/material";
import { useControlField } from "remix-validated-form";

type TextEditorProps = {
  name: string;
  placeholder?: string;
};

export default function TextEditor({ placeholder, name }: TextEditorProps) {
  const [text, setText] = useControlField<string | undefined>(name);

  return <TextareaAutosize value={text} placeholder={placeholder} />;
}
