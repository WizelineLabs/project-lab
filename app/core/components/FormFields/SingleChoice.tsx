import React from 'react';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel';

interface RadioButtonGroupProps {
  label: string;
  name: string;
  id: string;
  options: string[]; 
}

const RadioButtonGroup: React.FC<RadioButtonGroupProps> = ({ label, name, id, options }) => {
  return (
    <div style={{marginTop: '15px', marginBottom: '15px'}}>
      <FormControl>
        <FormLabel>{label}</FormLabel>
        <RadioGroup 
        name={name} id={id}>
          {options.map((option) => (
            <FormControlLabel key={option} value={option} control={<Radio />} label={option} />
          ))}
        </RadioGroup>
      </FormControl>
    </div>
  );
}

export default RadioButtonGroup;
