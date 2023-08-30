import React from 'react';
import { TextField } from '@mui/material';

interface TextInputProps {
  label: string;
  name: string;
  id: string
}

const TextInput: React.FC<TextInputProps> = ({ label, name, id }) => {
  return (
    <div style={{marginTop: '15px', marginBottom: '15px'}}>
      <TextField className="form-component"
        label={label}
        name={name}
        id={id}
        fullWidth
        margin="normal"
        multiline
        maxRows={4}
      />
    </div>
  );
};

export default TextInput;
