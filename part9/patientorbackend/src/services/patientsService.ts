import { v4 as uuidv4 } from 'uuid';
import patientsData from '../../data/patients';
import { Patient, NonSensitivePatient, NewPatient } from '../types';

const patients: Patient[] = patientsData;

const getNonSensitivePatients = (): NonSensitivePatient[] => {
  return patients.map(
    ({ ssn: _ssn, ...nonSensitivePatient }) => nonSensitivePatient
  );
};

const findById = (id: unknown): Patient | undefined => {
  return patients.find(patient => patient.id === id);
};

const addPatient = (entry: NewPatient): Patient => {
  const addedPatient: Patient = { ...entry, id: uuidv4() };

  patients.push(addedPatient);
  return addedPatient;
};

export default {
  getNonSensitivePatients,
  findById,
  addPatient
};