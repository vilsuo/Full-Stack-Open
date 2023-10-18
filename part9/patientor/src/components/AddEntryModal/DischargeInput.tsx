import { Stack, TextField, Typography } from '@mui/material';
import { Discharge } from '../../types';
import { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';

interface Props {
  date: Dayjs | null;
  criteria: Discharge['criteria'];
  setDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  setCriteria: React.Dispatch<React.SetStateAction<Discharge['criteria']>>;
}

const DischargeInput = ({ date, setDate, criteria, setCriteria }: Props) => {
  return (
    <Stack sx={{ border: 1, borderRadius: 1, p: 2 }} gap={1}>
      <Typography variant='h6'>Discharge</Typography>
      <DatePicker
        label='Date'
        value={date}
        onChange={(newValue) => setDate(newValue)}
      />
      <TextField
        variant='standard'
        label='Criteria'
        fullWidth
        value={criteria}
        onChange={({ target }) => setCriteria(target.value)}
        multiline
      />
    </Stack>
  );
};

export default DischargeInput;

