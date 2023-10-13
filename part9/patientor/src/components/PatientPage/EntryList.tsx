import { Diagnosis, Entry } from "../../types";
import { Typography } from "@mui/material";
/*
import { useState, useEffect } from 'react';
import diagnosesService from '../../services/diagnoses';
import axios from 'axios';
*/

interface DiagnosisEntryProps {
  code: string;
  diagnoses: Diagnosis[];
}

const DiagnosisEntry = ({ code, diagnoses } : DiagnosisEntryProps) => {
  const diagnosis = diagnoses.find(diagnosis => diagnosis.code === code);
  return (
    <li>
      {diagnosis?.code} {diagnosis?.name}
    </li>
  );
};

interface EntryItemProps {
  entry: Entry;
  diagnoses: Diagnosis[];
}

const EntryItem = ({ entry, diagnoses }: EntryItemProps) => {

  return (
    <div>
      <span>{entry.date} {entry.description}</span>
      <ul>
        {entry.diagnosisCodes?.map(code => 
          <DiagnosisEntry
            key={code}
            code={code}
            diagnoses={diagnoses}
          />
        )}
      </ul>
    </div>
  );
};

interface EntryListProps {
  entryList: Entry[];
  diagnoses: Diagnosis[];
}

const EntryList = ({ entryList, diagnoses }: EntryListProps) => {
  return (
    <div>
      <Typography variant="h6">entries</Typography>
      {entryList.map(entry =>
        <EntryItem
          key={entry.id}
          entry={entry}
          diagnoses={diagnoses}
        />
      )}
    </div>
  );
};

export default EntryList;