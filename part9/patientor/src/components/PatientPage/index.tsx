import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import patientService from "../../services/patients";
import EntryList from "./EntryList";
import { Diagnosis, Patient } from "../../types";
import GenderIcon from "./icons/GenderIcon";
import { Stack, Typography, Button } from "@mui/material";
import AddEntryModal from "../AddEntryModal";
import axios from 'axios';

interface Props {
  diagnoses: Diagnosis[];
}

const PatientPage = ({ diagnoses }: Props) => {
  const [patient, setPatient] = useState<Patient | null>(null);

  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [error, setError] = useState<string>();

  const openModal = (): void => setModalOpen(true);

  const closeModal = (): void => {
    setModalOpen(false);
    setError(undefined);
  };

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
              const message = error.response.data.replace(
                'Something went wrong. Error: ', ''
              );
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

  const submitNewEntry = async (values: object) => {
    if (id === undefined || !patient) {
      console.log('error: patient not found');
      return;
    }

    try {
      const entry = await patientService.createEntry(id, values);

      const {
        name,
        occupation,
        gender,
        ssn,
        dateOfBirth,
        entries
      } = patient;

      setPatient({
        id, name, occupation, gender, ssn, dateOfBirth,
        entries: entries.concat(entry)
      });

      closeModal();
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setError(error.response?.data.error);
      } else {
        setError('unknown error');
      }
    }
  };

  if (!patient) {
    return (
      <h1>Error: patient does not exist</h1>
    );
  }

  return (
    <div>
      <Stack spacing={2} sx={{ marginBottom: "1em" }}>
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
      <AddEntryModal
        modalOpen={modalOpen}
        onSubmit={submitNewEntry}
        error={error}
        onClose={closeModal}
        diagnoses={diagnoses}
      />
      <Button variant="contained" onClick={() => openModal()}>
        Add New Entry
      </Button>
    </div>
  );
};

export default PatientPage;