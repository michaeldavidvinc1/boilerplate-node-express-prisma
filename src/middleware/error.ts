import { Request, Response, NextFunction } from "express";
import {
  PrismaClientKnownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library";
import { ZodError } from "zod";
import { StatusCodes } from "http-status-codes";
import ApiError from "../utils/apiError";
import config from "../config/config";
import { logger } from "../config/logger";
import {HTTP_BAD_REQUEST, HTTP_INTERNAL_SERVER_ERROR} from "../constant/data";

const errorConverter = (
    err: Error | ZodError | PrismaClientKnownRequestError | PrismaClientValidationError | ApiError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
  let error = err;

  if (error instanceof ZodError) {
    const errors = error.errors.map((e) => ({
      path: e.path.join("."),
      message: e.message,
    }));

    error = new ApiError(
        HTTP_BAD_REQUEST,
        "Validation failed",
        false,
        err.stack
    );

    (error as any).errors = errors;
  }

  else if (error instanceof PrismaClientKnownRequestError) {
    error = new ApiError(
        HTTP_BAD_REQUEST,
        `Prisma error: ${error.message}`,
        false,
        err.stack
    );
  }
  else if (error instanceof PrismaClientValidationError) {
    error = new ApiError(
        HTTP_BAD_REQUEST,
        `Prisma validation error: ${error.message}`,
        false,
        err.stack
    );
  }

  else if (!(error instanceof ApiError)) {
    const statusCode =
        error instanceof Error && "statusCode" in error
            ? (error.statusCode as number)
            : HTTP_INTERNAL_SERVER_ERROR;
    const message = error.message || StatusCodes[statusCode];
    error = new ApiError(statusCode, message, false, err.stack);
  }

  next(error);
};

const errorHandler = (err: ApiError, req: Request, res: Response, next: NextFunction) => {
  let { statusCode, message } = err;

  if (config.env === "production" && !err.isOperational) {
    statusCode = HTTP_INTERNAL_SERVER_ERROR;
    message = StatusCodes[HTTP_INTERNAL_SERVER_ERROR];
  }

  res.locals.errorMessage = err.message;

  const response: any = {
    code: statusCode,
    message,
    ...(err instanceof ApiError && (err as any).errors && { errors: (err as any).errors }),
    ...(config.env === "development" && { stack: err.stack }),
  };

  logger.error(
      `Error ${statusCode} on ${req.method} ${req.originalUrl}: ${message}`,
      {
        ...(config.env === "development" && { stack: err.stack }),
        ...(req.body && Object.keys(req.body).length > 0 && { body: req.body }),
        ip: req.ip,
        userAgent: req.headers["user-agent"],
      }
  );

  if (config.env === "development") {
    logger.error(err);
  }

  res.status(statusCode).send(response);
};

export { errorConverter, errorHandler };
