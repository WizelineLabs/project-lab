import { useEffect, useState } from "react";
import { useQuill } from "react-quilljs";

type TextEditorProps = {
  name: string;
  defaultValue?: string;
};

export default function TextEditor({ defaultValue, name }: TextEditorProps) {
  const modules = {
    toolbar: [
      [{ header: [1, 2, 3, 4, 5, 6, false] }],

      ["bold", "italic", "underline", "strike"],
      [{ align: [] }],
      [{ list: "ordered" }, { list: "bullet" }],
      [{ indent: "-1" }, { indent: "+1" }],
      ["link"],
    ],
  };

  const formats = [
    "bold",
    "italic",
    "underline",
    "strike",
    "align",
    "list",
    "indent",
    "header",
    "link",
  ];

  const placeholder = defaultValue;

  const { quill, quillRef } = useQuill({ modules, formats, placeholder });

  const [text, setText] = useState("");

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (_delta: any, _oldDelta: any, _source: any) => {
        setText(quill.root.innerHTML);
      });
    }
  }, [quill]);
  return (
    <div style={{ width: "100%" }}>
      <div id={name} ref={quillRef} />
      <input type="hidden" name={name} value={text} />
    </div>
  );
}
