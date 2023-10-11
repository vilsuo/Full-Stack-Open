export const calculateBmi = (height: number, weight: number): string => {
  const bmi = weight / Math.pow(height / 100, 2);

  let message: string;
  if (bmi >= 40) {
    message = 'Obese (class III)';

  } else if (bmi >= 35) {
    message = 'Obese (class II)';

  } else if (bmi >= 30) {
    message = 'Obese (class I)';

  } else if (bmi >= 25) {
    message = 'Overweight (pre-obese)';

  } else if (bmi >= 18.5) {
    message = 'Normal (healthy weight)';

  } else if (bmi >= 17) {
    message = 'Underweight (mild thinness)';

  } else if (bmi >= 16) {
    message = 'Underweight (moderate thinness)';

  } else {
    message = 'Underweight (severe thinness)';
  }

  return message;
};

/*
interface BmiValues {
  height: number,
  weight: number
}

export const parseBmiArguments = (args: string[]): BmiValues => {
  if (args.length < 4) throw new Error('Not enough arguments');
  if (args.length > 4) throw new Error('Too many arguments');

  if (!isNaN(Number(args[2])) && !isNaN(Number(args[3]))) {
    const height = Number(args[2]);
    const weight = Number(args[3]);
    if (height <= 0 || weight <= 0) {
      throw new Error('Provided values must be positive!');
    }
    return {
      height: Number(args[2]),
      weight: Number(args[3])
    };
  } else {
    throw new Error('Provided values were not numbers!');
  }
};

try {
  const { height, weight } = parseBmiArguments(process.argv);
  console.log(calculateBmi(height, weight));
} catch (error: unknown) {
  let errorMessage = 'Something bad happened.';
  if (error instanceof Error) {
    errorMessage += ' Error: ' + error.message;
  }
  console.log(errorMessage);
}
*/