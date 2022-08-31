import { useState, useEffect, PropsWithoutRef } from "react"
import { Field } from "react-final-form"
import { FormLabel, FormHelperText } from "@mui/material"
import Editor from "rich-markdown-editor"
const editorStyleNormal = {
  border: "1px solid #999",
  padding: "0 1em 1em 2em",
  minHeight: "3em",
  borderRadius: "4px",
  borderColor: "rgba(0, 0, 0, 0.23)",
}

const editorStyleAlert = {
  border: "1px solid #999",
  padding: "0 1em 1em 2em",
  minHeight: "3em",
  borderRadius: "4px",
  borderColor: "#d32f2f",
}

interface TextEditorProps {
  name: string
  label: string
  /** Field type. Doesn't include radio buttons and checkboxes */
  type?: "text" | "password" | "email" | "number"
  helperText?: string
  placeholder?: string
  fullWidth?: boolean
  style?: any
  initialValues?: any
  outerProps?: PropsWithoutRef<JSX.IntrinsicElements["div"]>
}

export const TextEditor = ({
  name,
  label,
  type,
  helperText,
  outerProps,
  initialValues,
  ...props
}: TextEditorProps) => {
  const [editorError, setEditorError] = useState(false)
  const notEmptyEditor = (value) => (notValidContent(value) ? "Required" : undefined)

  const notValidContent = (content: any) => {
    if (!content) return false
    const re = /\w/i
    return re.exec(content) ? false : true
  }

  return (
    <Field name={name} validate={notEmptyEditor}>
      {({ input, meta: { touched, error, submitError } }) => {
        const handleEditorChange = (value) => {
          input.onChange(value)
          if (isError || notValidContent(value)) {
            setEditorError(true)
          } else {
            setEditorError(false)
          }
        }
        const normalizedError = Array.isArray(error) ? error.join(", ") : error || submitError
        const isError = touched && normalizedError
        return (
          <div>
            <FormLabel
              error={(isError || editorError) && error ? error.length > 0 : false}
              required
            >
              {label}
            </FormLabel>
            <Editor
              defaultValue={input.value}
              placeholder={
                "For formatting your text using HTML markup hit the '/' (slash) character from your keyboard."
              }
              onChange={(getValue) => handleEditorChange(getValue())}
              style={(isError || editorError) && error ? editorStyleAlert : editorStyleNormal}
            ></Editor>
            <FormHelperText error={(isError || editorError) && error ? error.length > 0 : false}>
              {isError && error.length > 0 ? (
                <>
                  {error}
                  <br />
                </>
              ) : (
                helperText
              )}
              To add a new line break press the " &#9166; " (return) key twice from your keyboard.
              You can also use the 'Markdown Basic Syntax' language inline{" "}
              <a target="_blank" href="https://www.markdownguide.org/cheat-sheet/" rel="noreferrer">
                Learn more about it here
              </a>
            </FormHelperText>
          </div>
        )
      }}
    </Field>
  )
}

export default TextEditor
