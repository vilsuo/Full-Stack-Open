import { TextField, MenuItem } from "@mui/material";
import { filter } from 'lodash';
import { HealthCheckRating } from "../../types";

interface HealthCheckRatingOption {
  label: HealthCheckRating;
  value: string;
}

const healthCheckOptions: HealthCheckRatingOption[] = filter(HealthCheckRating, (key, _value) => typeof key === 'string')
  .map(v => {
    return ({ value: HealthCheckRating[v], label: v });
  });


interface Props {
  healthCheckRating: HealthCheckRating;
  setHealthCheckRating: React.Dispatch<React.SetStateAction<HealthCheckRating>>;
}

const HealthCheckRatingOptionsInput = ({ healthCheckRating, setHealthCheckRating }: Props) => {
  return (
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
  );
};

export default HealthCheckRatingOptionsInput;