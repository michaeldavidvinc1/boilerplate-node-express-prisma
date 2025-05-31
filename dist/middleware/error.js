"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorHandler = exports.errorConverter = void 0;
const library_1 = require("@prisma/client/runtime/library");
const zod_1 = require("zod");
const http_status_codes_1 = require("http-status-codes");
const apiError_1 = __importDefault(require("../utils/apiError"));
const config_1 = __importDefault(require("../config/config"));
const logger_1 = require("../config/logger");
const data_1 = require("../constant/data");
const errorConverter = (err, req, res, next) => {
    let error = err;
    if (error instanceof zod_1.ZodError) {
        const errors = error.errors.map((e) => ({
            path: e.path.join("."),
            message: e.message,
        }));
        error = new apiError_1.default(data_1.HTTP_BAD_REQUEST, "Validation failed", false, err.stack);
        error.errors = errors;
    }
    else if (error instanceof library_1.PrismaClientKnownRequestError) {
        error = new apiError_1.default(data_1.HTTP_BAD_REQUEST, `Prisma error: ${error.message}`, false, err.stack);
    }
    else if (error instanceof library_1.PrismaClientValidationError) {
        error = new apiError_1.default(data_1.HTTP_BAD_REQUEST, `Prisma validation error: ${error.message}`, false, err.stack);
    }
    else if (!(error instanceof apiError_1.default)) {
        const statusCode = error instanceof Error && "statusCode" in error
            ? error.statusCode
            : data_1.HTTP_INTERNAL_SERVER_ERROR;
        const message = error.message || http_status_codes_1.StatusCodes[statusCode];
        error = new apiError_1.default(statusCode, message, false, err.stack);
    }
    next(error);
};
exports.errorConverter = errorConverter;
const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;
    if (config_1.default.env === "production" && !err.isOperational) {
        statusCode = data_1.HTTP_INTERNAL_SERVER_ERROR;
        message = http_status_codes_1.StatusCodes[data_1.HTTP_INTERNAL_SERVER_ERROR];
    }
    res.locals.errorMessage = err.message;
    const response = Object.assign(Object.assign({ code: statusCode, message }, (err instanceof apiError_1.default && err.errors && { errors: err.errors })), (config_1.default.env === "development" && { stack: err.stack }));
    if (config_1.default.env === "development") {
        logger_1.logger.error(err);
    }
    res.status(statusCode).send(response);
};
exports.errorHandler = errorHandler;
