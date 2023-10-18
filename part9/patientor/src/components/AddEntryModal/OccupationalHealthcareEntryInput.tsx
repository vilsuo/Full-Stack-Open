import { Stack, TextField, Typography } from '@mui/material';
import { Dayjs } from 'dayjs';
import { DatePicker } from '@mui/x-date-pickers';

interface Props {
  employerName: string;
  setEmployerName: React.Dispatch<React.SetStateAction<string>>;
  sickLeaveStartDate: Dayjs | null;
  setSickLeaveStartDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
  sickLeaveEndDate: Dayjs | null;
  setSickLeaveEndDate: React.Dispatch<React.SetStateAction<Dayjs | null>>;
}

const OccupationalHealthcareEntryInput = ({
  employerName, setEmployerName,
  sickLeaveStartDate, setSickLeaveStartDate,
  sickLeaveEndDate, setSickLeaveEndDate
}: Props) => {

  return (
    <Stack sx={{ border: 1, borderRadius: 1, p: 2 }} gap={1}>
      <Typography variant='h6'>Sick leave</Typography>
      <DatePicker
        label='Start'
        value={sickLeaveStartDate}
        onChange={(newValue) => setSickLeaveStartDate(newValue)}
      />
      <DatePicker
        label='End'
        value={sickLeaveEndDate}
        onChange={(newValue) => setSickLeaveEndDate(newValue)}
      />
      <TextField
        variant='standard'
        label='Employer name'
        fullWidth
        value={employerName}
        onChange={({ target }) => setEmployerName(target.value)}
        multiline
      />
    </Stack>
  );
};

export default OccupationalHealthcareEntryInput;