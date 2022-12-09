import { Checkbox, FormControlLabel, FormHelperText } from "@mui/material";
import { useControlField, useField } from "remix-validated-form";

export const LabeledCheckbox = ({
  name,
  label,
}: {
  name: string;
  label: string;
}) => {
  const { error } = useField(name);
  const [value, setValue] = useControlField<boolean>(name);

  return (
    <>
      <FormControlLabel
        control={
          <Checkbox
            name={name}
            checked={value}
            onChange={(e) => setValue(e.target.checked)}
          />
        }
        label={label}
      />
      <FormHelperText>{error}</FormHelperText>
    </>
  );
};
