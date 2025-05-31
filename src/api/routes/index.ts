import express from "express";
import {userRouter} from "./users.route";
import {authRouter} from "./auth.route";

export const endpoint = express.Router();

endpoint.use("/user", userRouter)
endpoint.use("/auth", authRouter)