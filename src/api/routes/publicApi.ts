import express from "express"
import { UserController } from "../controller/userController";

export const publicApi = express.Router();

publicApi.post("/user/create", UserController.createUser);
publicApi.get("/user", UserController.getAllUser);
publicApi.get("/user/:id", UserController.getSingleUser);
publicApi.put("/user/:id", UserController.updateUser);
publicApi.delete("/user/:id", UserController.deleteUser);