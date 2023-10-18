import { Dayjs } from 'dayjs';

export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled gender: ${JSON.stringify(value)}`
  );
};

export const formatDate = (date: Dayjs): string => {
  return date.format('YYYY/MM/DD');
};