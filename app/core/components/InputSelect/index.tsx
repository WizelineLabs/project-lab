import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

interface InputSelectProps {
  valuesList: Array<{ name: string }>;
  defaultValue?: String;
  name: string;
  label: string;
  helperText?: string;
  margin?: "normal" | "none" | "dense" | undefined;
  disabled?: boolean;
}

export const InputSelect = ({
  valuesList,
  defaultValue,
  name,
  label,
  helperText,
  margin,
  disabled,
}: InputSelectProps) => {
  return (
    <FormControl
      fullWidth
      id={name}
      //   error={isError}
      margin={margin || "normal"}
    >
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        style={{ width: "100%" }}
        id={name}
        sx={{ width: 300 }}
        label={label}
        // disabled={submitting || disabled}
        // value={input.value.name ? input.value.name : defaultValue}
        // onChange={(event) => {
        //   const newValue = valuesList.find(
        //     (item) => item.name === event.target.value
        //   );
        //    input.onChange(newValue);
        // }}
      >
        {valuesList.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      {/* <FormHelperText>{isError ? error : helperText}</FormHelperText> */}
    </FormControl>
  );
};

export default InputSelect;
