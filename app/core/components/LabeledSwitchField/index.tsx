import { FormControlLabel, Switch } from "@mui/material"

interface LabeledSwitchFieldProps {
  name: string
  label: string
  initialValues?: boolean
}


export const LabeledSwitchField = ({ label, name, initialValues }: LabeledSwitchFieldProps) => {
  return <FormControlLabel name={name} label={label} control={<Switch defaultChecked = {initialValues} />} />;
}

export default LabeledSwitchField
