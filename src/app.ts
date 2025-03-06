import cookieParser from "cookie-parser";
import express, { NextFunction, Request } from "express";
import cors from "cors";
import ApiError from "./utils/apiError";
import { StatusCodes } from "http-status-codes";
import { errorConverter, errorHandler } from "./middleware/error";
import config from "./config/config";
import { logger } from "./config/logger";
import { connectToDatabase, prismaClient } from "./config/db";

const app = express();

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// parse cookie
app.use(cookieParser());

// enable cors
app.use(cors({ credentials: true }));
app.options("*", cors());

// send back a 404 error for any unknown api request
app.use((next: NextFunction) => {
  next(new ApiError(StatusCodes.NOT_FOUND, "Not found"));
});

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

const checkDatabaseConnection = async () => {
  try {
    await prismaClient.$connect();
    logger.info("Successfully connected to the database");
  } catch (error) {
    logger.error("Failed to connect to the database", error);
    process.exit(1); // Keluar dari aplikasi jika gagal terhubung
  }
};

// Panggil fungsi cek koneksi database
checkDatabaseConnection();

app.listen(config.port, () => {
  logger.info(`Server running on localhost:${config.port}`);
});
