interface ExerciseReport {
  periodLength: number,
  trainingDays: number,
  success: boolean,
  rating: number,
  ratingDescription: string,
  target: number,
  average: number,
}

export const calculateExercises = (exerciseHours: number[], target: number): ExerciseReport => {
  const periodLength = exerciseHours.length;

  const daysWithExercises = exerciseHours.filter(hour => hour > 0);
  const trainingDays = daysWithExercises.length;

  const totalHours = daysWithExercises.reduce(
    (sum, value) => sum + value, 0
  );
  const averageHours = totalHours / periodLength;

  let rating;
  let ratingDescription;
  const value = 2 * averageHours - target;
  if (value >= target) {
    rating = 3;
    ratingDescription = 'excellent';
  } else if (value >= 0) {
    rating = 2;
    ratingDescription = 'not too bad but could be better';
  } else {
    rating = 1;
    ratingDescription = 'terrible';
  }

  return {
    periodLength,
    trainingDays,
    success: averageHours >= target,
    rating,
    ratingDescription,
    target,
    average: averageHours,
  };
};

/*
interface ExerciseParameters {
  exerciseHours: number[],
  target: number
}

const getAsNumberArray = (arr: string[]): number[] => {
  return arr.map(elem => {
    const num = Number(elem);
    if (!isNaN(num)) {
      return num;
    } else {
      throw new Error('Provided values are not convertable to numbers!');
    }
  });
};

const parseExerciseArguments = (args: string[]): ExerciseParameters => {
  if (args.length < 4) throw new Error('Not enough arguments');

  const [, , targetArg, ...exerciseHoursArg] = [ ...args ];
  
  const exerciseHours = getAsNumberArray(exerciseHoursArg);
  if (!isNaN(Number(targetArg))) {
    return {
      exerciseHours,
      target: Number(targetArg)
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { exerciseHours, target } = parseExerciseArguments(process.argv);
  console.log(calculateExercises(exerciseHours, target));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
*/