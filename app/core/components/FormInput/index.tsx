import { Stack, FormHelperText } from "@mui/material";
import { useField } from "remix-validated-form";

interface FormInputProps {
  name: string;
  label: string;
  isRequired?: boolean;
  value?: string;
}

export const FormInput = ({ name, isRequired, value }: FormInputProps) => {
  const { error } = useField(name);

  return (
    <Stack direction="column-reverse" alignItems="center">
      <input type="hidden" name={name} value={value} required={isRequired} />

      {error ? (
        <FormHelperText error={!!error}>Invalid Url</FormHelperText>
      ) : null}
    </Stack>
  );
};
