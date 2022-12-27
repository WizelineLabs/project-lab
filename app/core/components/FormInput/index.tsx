import { Stack } from "@mui/material";
import { useField } from "remix-validated-form";
import { FormHelperText } from "@mui/material";

type FormInputProps = {
  name: string;
  label: string;
  isRequired?: boolean;
  value?: string;
};

export const FormInput = ({
  name,
  label,
  isRequired,
  value,
  ...rest
}: FormInputProps) => {
  const { error } = useField(name);

  return (
    <Stack direction="column-reverse" alignItems="center">
      <input type="hidden" name={name} value={value} />

      {!!error && <FormHelperText error={!!error}>Invalid Url</FormHelperText>}
    </Stack>
  );
};
