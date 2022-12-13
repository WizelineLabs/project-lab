import styled from "@emotion/styled"

export const PersonalizaedFormInput = styled.div`
  width: 85px;
  .MuiFormControl-root {
    flex-direction: column-reverse;
  }

  .MuiInputBase-root {
    visibility: hidden;
  }

  input {
    visibility: hidden;
  }

  label {
    visibility: hidden;
  }
`
