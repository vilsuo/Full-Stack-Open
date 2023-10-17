import { SyntheticEvent, useState } from "react";
import {
  Grid, Button, TextField, MenuItem, Stack
} from "@mui/material";
import { EntryFormValues, Diagnosis, HealthCheckRating } from "../../types";
import { filter } from 'lodash';
import CodesAutoComplete from "./CodesAutoComplete";

interface HealthCheckRatingOption {
  label: HealthCheckRating;
  value: string;
}

const healthCheckOptions: HealthCheckRatingOption[] = filter(HealthCheckRating, (key, _value) => typeof key === 'string')
  .map(v => {
    //console.log('value', HealthCheckRating[v], 'label', v);
    return ({ value: HealthCheckRating[v], label: v });
  });

interface Props {
  onCancel: () => void;
  onSubmit: (values: EntryFormValues) => void;
  diagnoses: Diagnosis[];
}

const AddEntryForm = ({ onCancel, onSubmit, diagnoses }: Props) => {
  const [description, setDescription] = useState('');
  const [date, setDate] = useState('');
  const [specialist, setSpecialist] = useState('');
  const [diagnosesCodes, setDiagnosesCodes] = useState<Array<Diagnosis['code']>>([]);
  const [healthCheckRating, setHealthCheckRating] = useState<HealthCheckRating>(HealthCheckRating.Healthy);

  const addEntry = (event: SyntheticEvent) => {
    event.preventDefault();

    onSubmit({
      type: 'HealthCheck',
      description,
      date,
      specialist,
      diagnosisCodes: diagnosesCodes,
      healthCheckRating
    });
  };

  return (
    <div>
      <form onSubmit={addEntry}>
        <Stack gap={2}>
          <div>
            <label>
              Date
              <input
                type='date'
                value={date}
                onChange={ (event) => setDate(event.target.value) }
              />
            </label>
          </div>
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
          <CodesAutoComplete
            diagnoses={diagnoses.map(diagnosis => diagnosis.code)}
            codes={diagnosesCodes}
            setCodes={setDiagnosesCodes}
          />
          <TextField 
            variant="standard"
            label='Healthcheck rating'
            fullWidth
            value={healthCheckRating}
            onChange={({ target }) => setHealthCheckRating(Number(target.value))}
            select
          >
            {healthCheckOptions.map(option =>
              <MenuItem
                key={option.label}
                value={option.value}
              >
                {option.label}
              </MenuItem>
            )}
          </TextField>
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
