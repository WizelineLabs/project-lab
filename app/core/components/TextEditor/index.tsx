import { useEffect } from "react";
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

  const { quill, quillRef } = useQuill({ modules, formats, placeholder });

  useEffect(() => {
    if (quill) {
      quill.on("text-change", (_delta: any, _oldDelta: any, _source: any) => {
        console.log("Text change!");
        console.log(quill.getText()); // Get text only
        console.log(quill.getContents()); // Get delta contents
        console.log(quill.root.innerHTML); // Get innerHTML using quill
        console.log(quillRef.current.firstChild.innerHTML); // Get innerHTML using quillRef
      });
    }
  }, [quill]);
  return (
    <div style={{ width: "100%" }}>
      <div ref={quillRef} />
    </div>
  );
}
