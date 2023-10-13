import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import { Patient } from "../../types";
import { Gender } from "../../types";
import axios from 'axios';

import {
  Male,
  Female,
  QuestionMark
} from '@mui/icons-material';

import { Grid, Stack, Typography } from "@mui/material";

/**
 * Helper function for exhaustive type checking
 */
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

const PatientPage = () => {
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
      <Grid container direction="row" alignItems="center">
        <Grid item>
          <Typography variant="h6">{patient.name}</Typography>
        </Grid>
        <Grid item>
          <GenderIcon gender={patient.gender} />
        </Grid>
      </Grid>
      <Stack>
        <span>ssn: {patient.ssn}</span>
        <span>occupation: {patient.occupation}</span>
      </Stack>
    </div>
  );
};

export default PatientPage;