import { NextFunction, Request, Response } from "express";

export const errorHandler = (error: Error, _request: Request, response: Response, _next: NextFunction) => {
  let errorMessage = 'Something bad happened: ';
  if (error instanceof Error) {
    errorMessage += error.message;
    console.log(errorMessage)
    return response.status(400).send({ error : errorMessage });
  }

  console.log('Something went wrong')
  return response.status(400).send({ error: 'Something went wrong' });
};

export default {
  errorHandler
};