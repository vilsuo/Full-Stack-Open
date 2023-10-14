import { Diagnosis, Entry, Discharge, SickLeave } from "../../types";
import { Stack, Typography } from "@mui/material";
import DiagnosisList from "./DiagnosisList";
import { assertNever } from "../../utils";
import TypeIcon from "./icons/TypeIcon";
import HealthIcon from "./icons/HealthIcon";

interface EntryHeaderProps {
  entry: Entry;
}

const EntryHeader = ({ entry }: EntryHeaderProps) => {
  return (
    <Stack direction="row" alignItems="center" spacing={1}>
      <span>{entry.date}</span>
      <TypeIcon type={entry.type} />
      { 'employerName' in entry && <span>{entry.employerName}</span> }
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

interface SickLeaveEntryProps {
  sickLeave?: SickLeave;
}

const SickLeaveEntry = ({ sickLeave }: SickLeaveEntryProps) => {
  if (!sickLeave) {
    return null;
  }

  return (
    <span>
      Sick leave {sickLeave.startDate} — {sickLeave.endDate}
    </span>
  );
};

interface EntryItemFrameProps {
  entry: Entry;
  diagnoses: Diagnosis[];
  children: JSX.Element | JSX.Element[];
}

const EntryItemFrame = ({ entry, diagnoses, children }: EntryItemFrameProps) => {
  return (
    <Stack sx={{ border: 1, borderRadius: "5px", padding: 1 }}>
      <EntryHeader entry={entry} />
      <em>{entry.description}</em>
      <DiagnosisList
        codes={entry.diagnosisCodes}
        diagnoses={diagnoses}
      />
      {
        children
      }
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
        <EntryItemFrame entry={entry} diagnoses={diagnoses} >
          <HealthIcon rating={entry.healthCheckRating} />
        </EntryItemFrame>
      );
    case "Hospital":
      return (
        <EntryItemFrame entry={entry} diagnoses={diagnoses} >
          <DischargeItem discharge={entry.discharge} />
        </EntryItemFrame>
      );
    case "OccupationalHealthcare":
      return (
        <EntryItemFrame entry={entry} diagnoses={diagnoses} >
          <SickLeaveEntry sickLeave={entry.sickLeave} />
        </EntryItemFrame>
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