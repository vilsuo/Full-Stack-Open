import { SyntheticEvent } from "react";
import { TextField, Autocomplete, Box } from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { Diagnosis } from "../../types";

interface Props {
  diagnoses: Array<Diagnosis['code']>;
  codes: Array<Diagnosis['code']>;
  setCodes: React.Dispatch<React.SetStateAction<Array<Diagnosis['code']>>>;
}

const DiagnosesCodesInput = ({ diagnoses, codes, setCodes }: Props) => {
  
  const handleChange = (
    _event: SyntheticEvent,
    value: Diagnosis['code'] | Array<Diagnosis['code']>) => {

    console.log('new value', value);
    setCodes(typeof value === 'string' ? [value] : value);
  };

  return (
    <Autocomplete
      multiple
      options={ diagnoses.sort((x, y) => x < y ? -1 : 1) }
      getOptionLabel={(option) => option}
      value={codes}
      fullWidth
      onChange={handleChange}
      renderInput={(params) => (
        <TextField
          { ...params }
          variant='outlined'
          label='Diagnoses codes'
        />
      )}
      renderOption={(props, option, { selected }) => (
        <li { ...props } key={option} value={option}>
          <Box sx={{ flexGrow: 1, }}>{option}</Box>
          <Box>{selected ? <CheckIcon color="info" /> : null}</Box>
        </li>
      )}
    />
  );
};

export default DiagnosesCodesInput;