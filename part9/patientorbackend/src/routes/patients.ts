import express from 'express';
import patientsService from '../services/patientsService';
import { toNewPatient } from '../utils';
import { NewPatient } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  const patient = patientsService.findById(id);
  if (!patient) {
    return res.status(404).send({ error: 'patient not found' });
  } else {
    return res.json(patient);
  }
});

router.post('/', (req, res) => {
  try {
    const newPatient: NewPatient = toNewPatient(req.body);
    const createdPatient = patientsService.addPatient(newPatient);

    res.status(201).send(createdPatient);
    
  } catch (error: unknown) {
    let errorMessage = 'Something bad happened: ';
    if (error instanceof Error) {
      errorMessage += error.message;
    }
    res.status(400).send({ error : errorMessage });
  }
});

export default router;