import { Typography } from "@mui/material";
import { Suspense, lazy, useEffect, useState } from "react";
import type { ReactNode } from "react";
import { useControlField, useField } from "remix-validated-form";

const LazyMDEditor = lazy(() => import("@uiw/react-md-editor"));

export function ClientOnly({ children }: { children: ReactNode }) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);
  return mounted ? <>{children}</> : null;
}

export default function TextEditor({
  placeholder,
  name,
  label,
  height,
}: {
  name: string;
  label?: string;
  placeholder?: string;
  height?: number;
}) {
  const [text, setText] = useControlField<string | undefined>(name);
  const { error } = useField(name);

  return (
    <>
      <ClientOnly>
        <Typography>{label}</Typography>
        <Suspense fallback="">
          <input name={name} type="hidden" value={text || ""} />
          <LazyMDEditor
            value={text || ""}
            textareaProps={{
              placeholder,
            }}
            onChange={setText}
            height={height}
          />
        </Suspense>
      </ClientOnly>
      {error ? <Typography color="error">{error}</Typography> : null}
    </>
  );
}
