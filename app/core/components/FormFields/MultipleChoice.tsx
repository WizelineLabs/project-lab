import React from 'react';
import { Checkbox, FormControlLabel, FormGroup } from '@mui/material';

interface MultipleChoiceProps {
  label: string;
  options: string[];
  selectedOptions: string[];
  name: string;
  onChange: (selectedOptions: string[]) => void;
}

const MultipleChoice: React.FC<MultipleChoiceProps> = ({
  label,
  options,
  selectedOptions,
  name,
  onChange,
}) => {
  return (
    <div style={{marginTop: '15px', marginBottom: '15px'}}>
    <FormGroup className="form-component">
      <legend>{label}</legend>
      {options.map((option) => (
        <FormControlLabel
          key={option}
          control={
            <Checkbox
              checked={selectedOptions.includes(option)}
              onChange={() =>
                onChange(
                  selectedOptions.includes(option)
                    ? selectedOptions.filter((o) => o !== option)
                    : [...selectedOptions, option]
                )
              }
            />
          }
          label={option}
          name={name}
        />
      ))}
    </FormGroup>
    </div>
  );
};

export default MultipleChoice;
