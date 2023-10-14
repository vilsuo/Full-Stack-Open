import { Diagnosis, Entry, HealthCheckEntry, HospitalEntry, Discharge, OccupationalHealthcareEntry, SickLeave } from "../../types";
import { Stack, Typography } from "@mui/material";
import DiagnosisList from "./DiagnosisList";
import { assertNever } from "../../utils";
import TypeIcon from "./TypeIcon";
import HealthIcon from "./HealthIcon";

interface DateEntryProps {
  entry: Entry;
}

const DateEntry = ({ entry }: DateEntryProps) => {
  return (
    <Stack direction="row" alignItems="center">
      <span>{entry.date}</span>
      <TypeIcon type={entry.type} />
    </Stack>
  );
};

interface HealthCheckItemProps {
  entry: HealthCheckEntry;
  diagnoses: Diagnosis[];
}

const HealthCheckItem = ({ entry, diagnoses }: HealthCheckItemProps) => {
  return (
    <Stack sx={{ border: 1, borderRadius: "3px", padding: 1 }}>
      <DateEntry entry={entry} />
      <em>{entry.description}</em>
      <DiagnosisList
        codes={entry.diagnosisCodes}
        diagnoses={diagnoses}
      />
      <HealthIcon rating={entry.healthCheckRating} />
      <span style={{ marginTop: 10 }}>
        diagnose by {entry.specialist}
      </span>
    </Stack>
  );
};

interface DischargeItemProps {
  discharge: Discharge;
}

const DischargeItem = ({ discharge } : DischargeItemProps) => {
  return (
    <Stack>
      <span>Discharged {discharge.date}</span>
      <em>{discharge.criteria}</em>
    </Stack>
  );
};

interface HospitalItemProps {
  entry: HospitalEntry;
  diagnoses: Diagnosis[];
}

const HospitalItem = ({ entry, diagnoses }: HospitalItemProps) => {
  return (
    <Stack sx={{ border: 1, borderRadius: "3px", padding: 1 }}>
      <DateEntry entry={entry} />
      <em>{entry.description}</em>
      <DiagnosisList
        codes={entry.diagnosisCodes}
        diagnoses={diagnoses}
      />
      <DischargeItem discharge={entry.discharge}/>
      <span style={{ marginTop: 10 }}>
        diagnose by {entry.specialist}
      </span>
    </Stack>
  );
};

interface SickLeaveEntryProps {
  sickLeave?: SickLeave;
}

const SickLeaveEntry = ({ sickLeave }: SickLeaveEntryProps) => {
  if (!sickLeave) {
    return null;
  }

  return (
    <span>Sick leave {sickLeave.startDate} — {sickLeave.endDate}</span>
  );
};

interface OccupationalHealthcareItemProps {
  entry: OccupationalHealthcareEntry;
  diagnoses: Diagnosis[];
}

const OccupationalHealthcareItem = ({ entry, diagnoses }: OccupationalHealthcareItemProps) => {
  return (
    <Stack sx={{ border: 1, borderRadius: "3px", padding: 1 }}>
      <Stack direction="row" alignItems="center">
        <DateEntry entry={entry} />
        <span>{entry.employerName}</span>
      </Stack>
      <em>{entry.description}</em>
      <DiagnosisList
        codes={entry.diagnosisCodes}
        diagnoses={diagnoses}
      />
      <SickLeaveEntry sickLeave={entry.sickLeave} />
      <span style={{ marginTop: 10 }}>
        diagnose by {entry.specialist}
      </span>
    </Stack>
  );
};

interface EntryItemProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryItem = ({ entry, diagnoses }: EntryItemProps) => {

  switch(entry.type) {
    case "HealthCheck":
      return (
        <HealthCheckItem entry={entry} diagnoses={diagnoses} />
      );
    case "Hospital":
      return (
        <HospitalItem entry={entry} diagnoses={diagnoses} />
      );
    case "OccupationalHealthcare":
      return (
        <OccupationalHealthcareItem entry={entry} diagnoses={diagnoses} />
      );
    default:
      return assertNever(entry);
  }
};

interface EntryListProps {
  entryList: Entry[];
  diagnoses: Diagnosis[];
}

const EntryList = ({ entryList, diagnoses }: EntryListProps) => {
  return (
    <div>
      <Typography variant="h6">entries</Typography>
      <Stack spacing={1}>
        {entryList.map(entry =>
          <EntryItem
            key={entry.id}
            entry={entry}
            diagnoses={diagnoses}
          />
        )}
      </Stack>
    </div>
  );
};

export default EntryList;