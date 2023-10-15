import express from 'express';
import patientsService from '../services/patientsService';
import { toNewPatient, toNewEntry } from '../utils';
import { NewPatient, NewEntry } from '../types';

const router = express.Router();

router.get('/', (_req, res) => {
  res.send(patientsService.getNonSensitivePatients());
});

router.get('/:id', (req, res) => {
  const id = req.params.id;

  const patient = patientsService.findById(id);
  if (!patient) {
    res.status(404).send({ error: 'Patient not found' });
  } else {
    res.json(patient);
  }
});

router.post('/', (req, res, next) => {
  try {
    const newPatient: NewPatient = toNewPatient(req.body);
    const createdPatient = patientsService.addPatient(newPatient);

    res.status(201).send(createdPatient);
    
  } catch (error: unknown) {
    next(error);
  }
});

router.post('/:id/entries', (req, res, next) => {
  const id = req.params.id;

  try {
    const newEntry: NewEntry = toNewEntry(req.body);
    const createdEntry = patientsService.addEntry(id, newEntry);

    res.status(201).send(createdEntry);

  } catch (error: unknown) {
    next(error);
  }
});

export default router;