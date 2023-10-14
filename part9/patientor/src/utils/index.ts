export const assertNever = (value: never): never => {
  throw new Error(
    `Unhandled gender: ${JSON.stringify(value)}`
  );
};