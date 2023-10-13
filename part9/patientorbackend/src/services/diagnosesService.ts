import diagnosesData from '../../data/diagnoses.json';
import { Diagnosis } from '../types';

const diagnoses: Diagnosis[] = diagnosesData;

const getDiagnoses = (): Diagnosis[] => {
  return diagnoses;
};

const getByCode = (code: unknown) => {
  return diagnoses.find(diagnose => diagnose.code === code);
};

export default {
  getDiagnoses,
  getByCode
};