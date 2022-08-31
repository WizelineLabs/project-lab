import { Field, FieldRenderProps } from "react-final-form"
import { Checkbox, FormControlLabel, Switch } from "@mui/material"

interface LabeledSwitchFieldProps {
  name: string
  label: string
  initialValues?: boolean
}
type Props = FieldRenderProps<boolean, any>

const CheckboxInput: React.FC<Props> = ({ input: { value, ...input } }: Props) => (
  <Switch {...input} defaultChecked={input.initialValue} />
)

export const LabeledSwitchField = ({ label, name, initialValues }: LabeledSwitchFieldProps) => {
  return (
    <FormControlLabel
      label={label}
      control={<Field name={name} component={CheckboxInput} type="checkbox" />}
    />
  )
}

export default LabeledSwitchField
