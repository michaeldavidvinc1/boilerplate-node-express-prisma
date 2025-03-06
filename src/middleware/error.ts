import { Request, Response, NextFunction } from 'express';
import { PrismaClientKnownRequestError, PrismaClientValidationError } from '@prisma/client/runtime/library';
import { ZodError } from 'zod';
import { StatusCodes } from 'http-status-codes';
import ApiError from '../utils/apiError';
import config from '../config/config';
import { logger } from '../config/logger';

const errorConverter = (
  err: Error | ZodError | PrismaClientKnownRequestError | PrismaClientValidationError | ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let error = err;

  if (error instanceof ZodError) {
    const message = error.errors.map((e) => e.message).join(', ');
    error = new ApiError(StatusCodes.BAD_REQUEST, message, false, err.stack);
  }

  else if (error instanceof PrismaClientKnownRequestError) {
    const message = `Prisma error: ${error.message}`;
    error = new ApiError(StatusCodes.BAD_REQUEST, message, false, err.stack);
  } else if (error instanceof PrismaClientValidationError) {
    const message = `Prisma validation error: ${error.message}`;
    error = new ApiError(StatusCodes.BAD_REQUEST, message, false, err.stack);
  }

  else if (!(error instanceof ApiError)) {
    const statusCode =
      error instanceof Error && 'statusCode' in error
        ? (error.statusCode as number)
        : StatusCodes.INTERNAL_SERVER_ERROR;
    const message = error.message || StatusCodes[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

const errorHandler = (
  err: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let { statusCode, message } = err;

  if (config.env === 'production' && !err.isOperational) {
    statusCode = StatusCodes.INTERNAL_SERVER_ERROR;
    message = StatusCodes[StatusCodes.INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  // Format respons
  const response = {
    code: statusCode,
    message,
    ...(config.env === 'development' && { stack: err.stack }), 
  };

  if (config.env === 'development') {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };