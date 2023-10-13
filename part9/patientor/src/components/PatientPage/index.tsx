import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import EntryList from "./EntryList";
import { Diagnosis, Patient } from "../../types";
import { Gender } from "../../types";
import axios from 'axios';

import {
  Male,
  Female,
  QuestionMark
} from '@mui/icons-material';

import { Stack, Typography } from "@mui/material";

const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled gender: ${JSON.stringify(value)}`
  );
};

interface GenderProps {
  gender: Gender;
}

const GenderIcon = ({ gender } : GenderProps) => {
  switch (gender) {
    case Gender.Male:
      return <Male />;
    case Gender.Female:
      return <Female />;
    case Gender.Other:
      return <QuestionMark />;
    default:
      return assertNever(gender);
  }
};

interface PatientPageProps {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: PatientPageProps) => {
  const [patient, setPatient] = useState<Patient | null>(null);
  const id = useParams().id;

  useEffect(() => {
    const fetchPatient = async () => {
      if (id) {
        try {
          const foundPatient = await patientService.findById(id);
          setPatient(foundPatient);

        } catch (error: unknown) {
          if (axios.isAxiosError(error)) {
            if (error?.response?.data && typeof error?.response?.data === "string") {
              const message = error.response.data.replace('Something went wrong. Error: ', '');
              console.error(message);
            } else {
              console.log("Unrecognized axios error");
            }
          } else {
            console.error("Unknown error", error);
          }
          setPatient(null);
        }
      }
    };
    void fetchPatient();
  }, [id]);

  if (!patient) {
    return (
      <h1>Error: patient does not exist</h1>
    );
  }

  return (
    <div>
      <Stack spacing={2}>
        <Stack direction="row" alignItems="center">
          <Typography variant="h5">{patient.name}</Typography>
          <GenderIcon gender={patient.gender} />
        </Stack>
        <Stack>
          <span>ssn: {patient.ssn}</span>
          <span>occupation: {patient.occupation}</span>
        </Stack>
        <EntryList
          entryList={patient.entries}
          diagnoses={diagnoses}
        />
      </Stack>
    </div>
  );
};

export default PatientPage;