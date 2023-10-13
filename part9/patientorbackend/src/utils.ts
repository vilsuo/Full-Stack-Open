import { NewPatient, Gender, Entry } from "./types";

const isString = (text: unknown) : text is string => {
  return typeof text === 'string' || text instanceof String;
};

const isGender = (param: string) : param is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(param);
};

const parseName = (name: unknown) => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDateOfBirth = (dateOfBirth: unknown) => {
  if (!isString(dateOfBirth)) {
    throw new Error('Incorrect or missing date of birth');
  }
  return dateOfBirth;
};

const parseSsn = (ssn: unknown) => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const parseGender = (gender: unknown): Gender => {
  if (!isString(gender) || !isGender(gender)) {
    throw new Error('Incorrect or gender: ' + gender);
  }
  return gender;
};

const parseOccupation = (occupation: unknown) => {
  if (!isString(occupation)) {
    throw new Error('Incorrect or missing occupation');
  }
  return occupation;
};

const newEntries = () => {
  return new Array<Entry>;
};

export const toCode = (code: unknown) => {
  if (!isString(code)) {
    throw new Error('Incorrect or missing code');
  }
  return code;
};

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object &&
      'gender' in object && 'occupation' in object) {

    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDateOfBirth(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: newEntries()
    };

    return newPatient;
  }

  throw new Error('Incorrect data: a field missing');
};