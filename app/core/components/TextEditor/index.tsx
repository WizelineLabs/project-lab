import { useQuill } from "react-quilljs";

type TextEditorProps = {
  defaultValue?: string;
};

export default function TextEditor({ defaultValue }: TextEditorProps) {
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

  const { quillRef } = useQuill({ modules, formats, placeholder });

  return (
    <div style={{ width: "100%" }}>
      <div ref={quillRef} />
    </div>
  );
}
