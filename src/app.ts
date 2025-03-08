import cookieParser from "cookie-parser";
import express, { NextFunction, Request } from "express";
import cors from "cors";
import { errorConverter, errorHandler } from "./middleware/error";
import config from "./config/config";
import { logger } from "./config/logger";
import { prismaClient } from "./config/db";
import { publicApi } from "./api/routes/publicApi";
import helmet from "helmet";

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
app.use(helmet())

app.use("/api/v1", publicApi)

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app