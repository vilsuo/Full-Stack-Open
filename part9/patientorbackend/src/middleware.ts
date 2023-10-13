import { NextFunction, Request, Response } from "express";

export const errorHandler = (error: Error, _request: Request, response: Response, next: NextFunction) => {
  let errorMessage = 'Something bad happened: ';
  if (error instanceof Error) {
    errorMessage += error.message;
    response.status(400).send({ error : errorMessage });
  }

  next(error);
};

export default {
  errorHandler
};