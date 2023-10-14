import { Diagnosis } from "../../types";

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

interface DiagnosisListProps {
  codes?: string[];
  diagnoses: Diagnosis[];
}

const DiagnosisList = ({ codes, diagnoses } : DiagnosisListProps) => {
  if (!codes) {
    return null;
  }

  return (
    <ul>
      {codes.map(code => 
        <DiagnosisEntry
          key={code}
          code={code}
          diagnoses={diagnoses}
        />
      )}
    </ul>
  );
};

export default DiagnosisList;