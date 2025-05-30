import cookieParser from "cookie-parser";
import express, { NextFunction, Request } from "express";
import cors from "cors";
import { errorConverter, errorHandler } from "./middleware/error";
import helmet from "helmet";
import {endpoint} from "./api/routes";

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

app.use("/api/v1", endpoint)

// convert error to ApiError, if needed
app.use(errorConverter);

// handle error
app.use(errorHandler);

export default app