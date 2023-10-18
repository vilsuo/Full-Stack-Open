import { SyntheticEvent, useState } from "react";
import {
  Grid, Button, TextField, Stack,
  FormControl, InputLabel, Select, MenuItem, SelectChangeEvent
} from "@mui/material";
import { Entry, Diagnosis, HealthCheckRating } from "../../types";
import DiagnosesCodesInput from "./DiagnosesCodesInput";
import HealthCheckRatingOptionsInput from "./HealthCheckOptionsInput";
import { assertNever, formatDate } from "../../utils";
import { DatePicker } from '@mui/x-date-pickers';
import { Dayjs } from 'dayjs';
import DischargeInput from "./DischargeInput";
import OccupationalHealthcareEntryInput from "./OccupationalHealthcareEntryInput";

interface EntryTypeSelectProps {
  type: Entry['type'];
  setType: React.Dispatch<React.SetStateAction<Entry['type']>>;
}

const EntryTypeSelect = ({ type, setType}: EntryTypeSelectProps) => {

  const handleChange = (event: SelectChangeEvent<typeof type>) => {
    event.target;
    setType(event.target.value as Entry['type']);
  };

  return (
    <FormControl fullWidth variant="standard">
      <InputLabel id="demo-simple-select-label">Type</InputLabel>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={type}
        label="Type"
        onChange={handleChange}
      >
        <MenuItem value='HealthCheck'>HealthCheck</MenuItem>
        <MenuItem value='Hospital'>Hospital</MenuItem>
        <MenuItem value='OccupationalHealthcare'>OccupationalHealthcare</MenuItem>
      </Select>
    </FormControl>
  );
};

interface Props {
  onCancel: () => void;
  onSubmit: (values: object) => void;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [type, setType] = useState<Entry['type']>('HealthCheck');

  // common for all entry types
  const [description, setDescription] = useState<string>('');
  const [date, setDate]               = useState<Dayjs | null>(null);
  //const [date, setDate]               = useState<string | null>(null);
  const [specialist, setSpecialist]   = useState<string>('');
  // optional
  const [diagnosesCodes, setDiagnosesCodes] = useState<Array<Diagnosis['code']>>([]);

  // type: 'HealthCheckEntry'
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  // type 'HospitalEntry'
  const [dischargeDate, setDischargeDate] = useState<Dayjs | null>(null);
  const [dischargeCriteria, setDischargeCriteria] = useState<string>('');

  // type: 'OccupationalHealthcareEntry'
  const [employerName, setEmployerName] = useState<string>('');
  // optional
  const [sickLeaveStartDate, setSickLeaveStartDate] = useState<Dayjs | null>(null);
  const [sickLeaveEndDate, setSickLeaveEndDate] = useState<Dayjs | null>(null);

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    let specific;
    switch (type) {
      case 'HealthCheck':
        specific = {
          healthCheckRating: healthCheckRating ? healthCheckRating : null
        };
        break;
      case 'Hospital':
        specific = {
          discharge: {
            date: dischargeDate ? formatDate(dischargeDate) : undefined,
            criteria: dischargeCriteria ? dischargeCriteria : undefined
          }
        };
        break;
      case 'OccupationalHealthcare':
        specific = {
          employerName: employerName ? employerName : undefined,
          sickLeave: (sickLeaveStartDate || sickLeaveEndDate) ? {
            startDate: sickLeaveStartDate ? formatDate(sickLeaveStartDate) : undefined,
            endDate: sickLeaveEndDate ? formatDate(sickLeaveEndDate) : undefined
          } : undefined
        };
        break;
      default:
        assertNever(type);
    }

    onSubmit({
      type,
      description:  description !== '' ? description : undefined,
      date:         date ? formatDate(date) : undefined,
      specialist:   specialist !== '' ? specialist : undefined,
      diagnosisCodes: diagnosesCodes,
      ...specific
    });
  };

  return (
    <div>
      <EntryTypeSelect type={type} setType={setType}/>
      <form onSubmit={addEntry}>
        <Stack gap={2}>
          <DatePicker  sx={{ mt: 2 }} 
            label="Date"
            value={date}
            onChange={(newValue) => setDate(newValue)}
          />
          <TextField
            variant="standard"
            label="Description"
            fullWidth
            value={description}
            onChange={({ target }) => setDescription(target.value)}
            multiline
          />
          <TextField
            variant="standard"
            label="Specialist"
            fullWidth
            value={specialist}
            onChange={({ target }) => setSpecialist(target.value)}
          />
          <DiagnosesCodesInput
            diagnoses={diagnoses.map(diagnosis => diagnosis.code)}
            codes={diagnosesCodes}
            setCodes={setDiagnosesCodes}
          />
          { (`${type}` === 'HealthCheck') &&
            <HealthCheckRatingOptionsInput
              healthCheckRating={healthCheckRating}
              setHealthCheckRating={setHealthCheckRating}
            />
          }
          { (`${type}` === 'Hospital') &&
            <DischargeInput
              date={dischargeDate}
              criteria={dischargeCriteria}
              setDate={setDischargeDate}
              setCriteria={setDischargeCriteria}
            />
          }
          { (`${type}` === 'OccupationalHealthcare') &&
            <OccupationalHealthcareEntryInput
              employerName={employerName}
              setEmployerName={setEmployerName}
              sickLeaveStartDate={sickLeaveStartDate}
              setSickLeaveStartDate={setSickLeaveStartDate}
              sickLeaveEndDate={sickLeaveEndDate}
              setSickLeaveEndDate={setSickLeaveEndDate}
            />
          }
          <Grid>
            <Grid item>
              <Button
                color="secondary"
                variant="contained"
                style={{ float: "left" }}
                type="button"
                onClick={onCancel}
              >
                Cancel
              </Button>
            </Grid>
            <Grid item>
              <Button
                style={{
                  float: "right",
                }}
                type="submit"
                variant="contained"
              >
                Add
              </Button>
            </Grid>
          </Grid>
        </Stack>
      </form>
    </div>
  );
};

export default AddEntryForm;
