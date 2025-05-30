import express from "express";
import {userRouter} from "./users.route";

export const endpoint = express.Router();

endpoint.use("/", userRouter)