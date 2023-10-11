import express = require('express');
import { calculateBmi } from './bmiCalculator';
import { calculateExercises } from './exerciseCalculator';

const app = express();

app.use(express.json());

app.get('/hello', (_req, res) => {
  res.send('Hello Full Stack!');
});

app.get('/bmi', (req, res) => {
  const weightParam = req.query.weight;
  const heightParam = req.query.height;
  if (!weightParam || !heightParam) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }
  
  const weight: number = Number(weightParam);
  const height: number = Number(heightParam);
  if (isNaN(weight) || isNaN(height)) {
    return res.status(400).send({ error: 'malformatted parameters' });
  }

  return res.send({
    weight,
    height,
    bmi: calculateBmi(height, weight)
  });
});

app.post('/exercises', (req, res) => {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
  const {
    daily_exercises: dailyExercisesParam,
    target: targetParam
  } = req.body;

  if (!targetParam || !dailyExercisesParam) {
    return res.status(400).send({
      error: "parameters missing"
    });
  }

  if (isNaN(Number(targetParam))) {
    return res.status(400).send({
      error: "malformatted parameters"
    });
  }

  if (!Array.isArray(dailyExercisesParam)) {
    return res.status(400).send({
      error: "malformatted parameters"
    });
  }

  const exerciseHours = dailyExercisesParam.map(param => Number(param));
  if (!exerciseHours.find(value => !isNaN(value))) {
    return res.status(400).send({
      error: "malformatted parameters"
    });
  }

  return res.send(calculateExercises(exerciseHours, Number(targetParam)));
});

const PORT = 3002;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});