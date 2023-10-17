import { 
  NewPatient, Gender, Entry, NewEntry, Diagnosis, HealthCheckRating, 
  Discharge, SickLeave
} from "./types";

const isString = (text: unknown) : text is string => {
  return typeof text === 'string' || text instanceof String;
};

const parseName = (name: unknown) => {
  if (!isString(name)) {
    throw new Error('Incorrect or missing name');
  }
  return name;
};

const parseDate = (date: unknown) => {
  if (!isString(date)) {
    throw new Error('Incorrect or missing date');
  }
  return date;
};

const parseSsn = (ssn: unknown) => {
  if (!isString(ssn)) {
    throw new Error('Incorrect or missing ssn');
  }
  return ssn;
};

const isGender = (param: string) : param is Gender => {
  return Object.values(Gender).map(g => g.toString()).includes(param);
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

export const toNewPatient = (object: unknown): NewPatient => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect or missing data');
  }

  if ('name' in object && 'dateOfBirth' in object && 'ssn' in object &&
      'gender' in object && 'occupation' in object) {

    const newPatient: NewPatient = {
      name: parseName(object.name),
      dateOfBirth: parseDate(object.dateOfBirth),
      ssn: parseSsn(object.ssn),
      gender: parseGender(object.gender),
      occupation: parseOccupation(object.occupation),
      entries: new Array<Entry>
    };

    return newPatient;
  }

  throw new Error('Incorrect data: a field missing');
};

const parseDescription = (description: unknown) => {
  if (!isString(description)) {
    throw new Error('Incorrect or missing description');
  }
  return description;
};

const parseSpecialist = (specialist: unknown) => {
  if (!isString(specialist)) {
    throw new Error('Incorrect or missing specialist');
  }
  return specialist;
};

const parseDiagnosisCodes = (object: object): Array<Diagnosis['code']> =>  {
  if (!('diagnosisCodes' in object)) {
    // we will just trust the data to be in correct form
    return [] as Array<Diagnosis['code']>;
  }

  return object.diagnosisCodes as Array<Diagnosis['code']>;
};

const isHealthCheckRating = (param: number): param is HealthCheckRating => {
  return param in HealthCheckRating;
};

const parseHealthCheckRating = (object: object) => {
  if (!('healthCheckRating' in object) ||
      !isHealthCheckRating(Number(object.healthCheckRating))) {

    throw new Error('Incorrect or missing healthCheckRating');
  }
  return Number(object.healthCheckRating);
};

const parseCriteria = (criteria: unknown) => {
  if (!isString(criteria)) {
    throw new Error('Incorrect or missing criteria');
  }
  return criteria;
};

const isDischarge = (param: unknown): param is Discharge => {
  if (typeof param !== 'object' || !param || 
      !('date' in param) || !('criteria' in param) ||
      !isString(param.date) || !isString(param.criteria)) {
    
    return false;
  }
  return true;
};

const parseDischarge = (object: object): Discharge => {
  if (!('discharge' in object) || !isDischarge(object.discharge)) {
    throw new Error('Incorrect or missing discharge');
  }

  return {
    date: parseDate(object.discharge.date),
    criteria: parseCriteria(object.discharge.criteria)
  };
};

const parseEmployerName = (object: object) => {
  if (!('employerName' in object) || !isString(object.employerName)) {
    throw new Error('Incorrect or missing employer name');
  }

  return object.employerName;
};

const isSickLeave = (param: unknown): param is SickLeave => {
  if (typeof param !== 'object' || !param || 
      !('startDate' in param) || !('endDate' in param) ||
      !isString(param.startDate) || !isString(param.endDate)) {
    
    return false;
  }
  return true;
};

const parseSickLeave = (sickLeave: unknown): SickLeave => {
  if (!isSickLeave(sickLeave)) {
    throw new Error('Incorrect sick leave');
  }

  return {
    startDate: parseDate(sickLeave.startDate),
    endDate: parseDate(sickLeave.endDate),
  };
};

export const toNewEntry = (object: unknown): NewEntry => {
  if (!object || typeof object !== 'object') {
    throw new Error('Incorrect data');
  }
  
  if ('type' in object && isString(object.type)) {

    if ('description' in object && 'date' in object && 'specialist' in object) {
      const newBaseEntry = {
        description: parseDescription(object.description),
        date: parseDate(object.date),
        specialist: parseSpecialist(object.specialist),
        // optional
        diagnosisCodes: parseDiagnosisCodes(object)
      };

      switch (object.type) {
        case 'HealthCheck':
          return ({
            type: 'HealthCheck',
            healthCheckRating: parseHealthCheckRating(object),
            ...newBaseEntry
          });
        case 'Hospital':
          return ({
            type: 'Hospital',
            discharge: parseDischarge(object),
            ...newBaseEntry
          });
        case 'OccupationalHealthcare':
          return ({
            type: 'OccupationalHealthcare',
            employerName: parseEmployerName(object),
            // optional
            sickLeave: ('sickLeave' in object) ? parseSickLeave(object.sickLeave) : undefined,
            ...newBaseEntry
          });
      }
    } else {
      throw new Error('Missing required data')
    }
  }

  throw new Error('Incorrect type');
};