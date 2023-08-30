import React from 'react';
import { LocalizationProvider } from '@mui/x-date-pickers'; 
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'; 
import { DatePicker } from '@mui/x-date-pickers/DatePicker';

interface DatePickerInputProps {
  label: string;
}

const DatePickerInput: React.FC<DatePickerInputProps> = ({ label }) => {
  return (
    <div style={{marginTop: '15px', marginBottom: '15px'}} >
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <DatePicker
        label={label}
      />
    </LocalizationProvider>
    </div>
  );
};

export default DatePickerInput;

