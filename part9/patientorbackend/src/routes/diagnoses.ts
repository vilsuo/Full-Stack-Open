import express from 'express';
import diagnosesService from '../services/diagnosesService';
import { toCode } from '../utils';

const router = express.Router();

router.get('/', (req, res, next) => {
  const codeQuery = req.query.code;
  if (!codeQuery) {
    res.send(diagnosesService.getDiagnoses());
    
  } else {
    try {
      const code = toCode(codeQuery);
      const diagnose = diagnosesService.getByCode(code);
      if (diagnose) {
        res.send(diagnose);
      } else {
        res.status(404).send({ error: 'diagnose not found' });
      }
    } catch (error: unknown) {
      next(error);
    }
  }
});

export default router;