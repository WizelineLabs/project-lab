import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  FormHelperText,
} from "@mui/material";

interface InputSelectProps {
  valuesList: { name: string }[];
  defaultValue?: string;
  name: string;
  label: string;
  helperText?: string;
  margin?: "normal" | "none" | "dense" | undefined;
  disabled?: boolean;
  value: string;
  handleChange: React.Dispatch<React.SetStateAction<{ name: string }>>;
}

export const InputSelectWOValidate = ({
  valuesList,
  defaultValue,
  name,
  label,
  helperText,
  margin,
  disabled,
  value,
  handleChange,
}: InputSelectProps) => {
  return (
    <FormControl fullWidth id={name} margin={margin || "normal"} size="small">
      <InputLabel id={name}>{label}</InputLabel>
      <Select
        style={{ width: "100%" }}
        id={name}
        sx={{ width: 300 }}
        label={label}
        value={value || defaultValue}
        onChange={(event) => {
          const newValue = valuesList.find(
            (item) => item.name === event.target.value
          );
          if (newValue) handleChange(newValue);
        }}
        disabled={disabled}
      >
        {valuesList.map((item) => (
          <MenuItem key={item.name} value={item.name}>
            {item.name}
          </MenuItem>
        ))}
      </Select>
      <FormHelperText>{helperText}</FormHelperText>
    </FormControl>
  );
};

export default InputSelectWOValidate;
