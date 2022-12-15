import { Stack } from "@mui/material";
import { useField } from "remix-validated-form";
import { FormHelperText } from "@mui/material";

type FormInputProps = {
  name: string;
  label: string;
  isRequired?: boolean;
  value?: string;
  setUrlWithError: any;
};

export const FormInput = ({
  name,
  label,
  isRequired,
  value,
  setUrlWithError,
  ...rest
}: FormInputProps) => {
  const { getInputProps, error } = useField(name);

  if (error === "Invalid url") {
    setUrlWithError(true);
  } else {
    setUrlWithError(false);
  }

  return (
    <Stack direction="column-reverse" alignItems="center">
      <input type="hidden" name={name} value={value} />

      {!!error && <FormHelperText error={!!error}>Invalid Url</FormHelperText>}
    </Stack>
  );
};
