import { v4 as uuidv4 } from 'uuid';
import patientsData from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient, NewEntry, Entry } from '../types';

const patients: Patient[] = patientsData;

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ ssn: _ssn, ...nonSensitivePatient }) => nonSensitivePatient
  );
};

const findById = (id: unknown): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const addPatient = (patient: NewPatient): Patient => {
  const addedPatient: Patient = { ...patient, id: uuidv4() };

  patients.push(addedPatient);
  return addedPatient;
};

const addEntry = (id: unknown, newEntry: NewEntry): Entry => {
  const entry: Entry = { ...newEntry, id: uuidv4() };

  const pat = patients.find(patient => patient.id === id);
  if (pat) {
    pat.entries.push(entry);
    return entry;
  }

  throw new Error('Patient not found');
};

export default {
  getNonSensitivePatients,
  findById,
  addPatient,
  addEntry
};