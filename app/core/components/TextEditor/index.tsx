import { useControlField } from "remix-validated-form";
import { Suspense, lazy, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { Typography } from "@mui/material";

let LazyMDEditor = lazy(() => import("@uiw/react-md-editor"));

type TextEditorProps = {
  name: string;
  label: string;
  placeholder?: string;
};

export function ClientOnly({ children }: { children: ReactNode }) {
  let [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
}

export default function TextEditor({
  placeholder,
  name,
  label,
}: TextEditorProps) {
  const [text, setText] = useControlField<string | undefined>(name);

  return (
    <ClientOnly>
      <Typography>{label}</Typography>
      <Suspense fallback="">
        <input name={name} type="hidden" value={text} />
        <LazyMDEditor
          value={text}
          placeholder={placeholder}
          onChange={setText}
        />
      </Suspense>
    </ClientOnly>
  );
}
